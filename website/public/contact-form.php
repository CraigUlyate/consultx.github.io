<?php
/**
 * ConsultX contact form handler (Afrihost PHP mail).
 * Accepts POST from /contact/ and emails the ConsultX team.
 */

declare(strict_types=1);

header('Cache-Control: no-store, no-cache, must-revalidate');
header('Content-Type: application/json; charset=UTF-8');

function respond(int $status, string $message, bool $ok = false): void
{
  http_response_code($status);
  echo json_encode([
    'ok' => $ok,
    'message' => $message,
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  respond(405, 'Please submit the contact form.');
}

// Honeypot — bots fill this; humans leave it empty.
$honeypot = trim((string) ($_POST['company_website'] ?? ''));
if ($honeypot !== '') {
  respond(200, 'Thanks — your message has been sent.', true);
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 120) {
  respond(422, 'Please enter your name.');
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
  respond(422, 'Please enter a valid email address.');
}

if ($message === '' || mb_strlen($message) > 5000) {
  respond(422, 'Please enter a short message.');
}

// Block header injection in email-related fields.
if (preg_match('/[\r\n]/', $name . $email) === 1) {
  respond(422, 'Invalid input.');
}

$recipients = [
  'info@consultx.co.za',
  'craig@consultx.co.za',
];

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$ref = $_SERVER['HTTP_REFERER'] ?? 'direct / unknown';
$when = gmdate('Y-m-d H:i:s') . ' UTC';

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);

$subject = 'ConsultX website enquiry from ' . $safeName;
$body = implode("\n", [
  'New consultation enquiry from consultx.co.za',
  '',
  'Name: ' . $safeName,
  'Email: ' . $safeEmail,
  'Time: ' . $when,
  'IP: ' . $ip,
  'Referrer: ' . $ref,
  'User-Agent: ' . $ua,
  '',
  'Message:',
  $message,
]);

$headers = [
  'From: ConsultX Website <noreply@consultx.co.za>',
  'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: ConsultX-Contact/1.0',
];

$to = implode(', ', $recipients);
$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
  respond(500, 'We could not send your message right now. Please email info@consultx.co.za.');
}

respond(200, 'Thanks — your message has been sent. We will get back to you shortly.', true);
