const fs = require('node:fs');
const path = require('node:path');
const root = 'C:/Users/craig/ai-accountant-mvp';
const target = path.join(root, 'app/api/v1/ai_chat.py');
let source = fs.readFileSync(target, 'utf8');
if (!source.includes('from app.agents.public_chat_safety import')) {
  source = source.replace('import uuid', 'import uuid\nfrom app.agents.public_chat_safety import contains_sensitive_input, PUBLIC_BOUNDARY');
  const marker = '    # Assemble SDK contents from conversation history';
  if (!source.includes(marker)) throw new Error('Public endpoint marker missing');
  source = source.replace(marker, `    # Screen before provider processing. This is heuristic, not complete DLP.
    if len(body.message) > 4000 or len(body.history or []) > 20 or any(len(t.content) > 8000 for t in (body.history or [])):
        raise HTTPException(status_code=413, detail="Public chat is for concise business scoping.")
    if any(contains_sensitive_input(t) for t in [body.message] + [turn.content for turn in (body.history or [])]):
        return ChatReply(id=f"pub_{uuid.uuid4().hex[:12]}", text=PUBLIC_BOUNDARY, tool_outcomes=[])

${marker}`);
  // Do not return upstream exceptions containing request/provider details.
  source = source.replace('detail=f"Gemini call failed: {e}"', 'detail="The advisor is temporarily unavailable."');
  source = source.replace('        for fc in fcalls:\n            result = await run_tool', '        for fc in fcalls:\n            if contains_sensitive_input(str(fc.get("args") or {})):\n                return ChatReply(id=f"pub_{uuid.uuid4().hex[:12]}", text=PUBLIC_BOUNDARY, tool_outcomes=[])\n            result = await run_tool');
}
fs.writeFileSync(target, source);
fs.copyFileSync(path.join(__dirname, 'assessment-system-prompt.md'), path.join(root, 'app/agents/public_assessment_prompt.md'));
fs.copyFileSync(path.join(__dirname, 'public_chat_safety.py'), path.join(root, 'app/agents/public_chat_safety.py'));
console.log('Updated local public-chat safeguards and prompt; not deployed.');
