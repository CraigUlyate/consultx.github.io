<?php
/**
 * AnNa Expense "Try it" tracker.
 * Sends a notification email, then redirects to the AnNa app.
 */

declare(strict_types=1);

$notifyTo = 'craig@consultx.co.za';
$redirectTo = 'https://anna-accounting.com/';

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$ref = $_SERVER['HTTP_REFERER'] ?? 'direct / unknown';
$when = gmdate('Y-m-d H:i:s') . ' UTC';

$subject = 'ConsultX: AnNa Expense "Try it" clicked';
$body = implode("\n", [
  'Someone clicked "Try it" for AnNa Expense on consultx.co.za.',
  '',
  'Time: ' . $when,
  'IP: ' . $ip,
  'Referrer: ' . $ref,
  'User-Agent: ' . $ua,
  '',
  'They are being redirected to: ' . $redirectTo,
]);

$headers = [
  'From: ConsultX Website <noreply@consultx.co.za>',
  'Reply-To: craig@consultx.co.za',
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: ConsultX-TryIt/1.0',
];

@mail($notifyTo, $subject, $body, implode("\r\n", $headers));

header('Cache-Control: no-store, no-cache, must-revalidate');
header('Location: ' . $redirectTo, true, 302);
exit;
