import { NextRequest, NextResponse } from "next/server";
const fs = require("fs");
const path = require("path");
export async function POST(req: NextRequest, { params }: { params: { flowId: string } }) {
  const reqBody = await req.json();
  const { flowId } = params;
  const { html } = reqBody;
  const filePath = path.join(process.cwd(), `public/flows/${flowId}.html`);
  try {
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, html, "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}