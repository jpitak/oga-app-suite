const moduleHints = {
  Marketing: 'Focus on conversion rate, CAC, ROAS, campaign efficiency and practical next steps.',
  Facial: 'Focus on demographic mix, sentiment, repeat visitors, dwell time, and customer behavior insights.',
  Robotics: 'Focus on active/idle state, task success, battery health, and operational risk.',
  Inventory: 'Focus on stock health, low stock risk, turnover ratio, aging stock, and restocking suggestions.',
  Product: 'Focus on top products, return rate, reviews, stock-to-sales ratio and upsell opportunities.'
};

function buildMockReply(message, module) {
  const text = message.toLowerCase();
  const intro = {
    Marketing: 'AI Marketing Analyst',
    Facial: 'AI Facial Insight Engine',
    Robotics: 'AI Robotics Supervisor',
    Inventory: 'AI Inventory Planner',
    Product: 'AI Product Strategist'
  }[module] || 'OGA AI Assistant';

  let bullets = [];
  if (text.includes('stock') || text.includes('inventory')) {
    bullets = [
      'ตรวจพบความเสี่ยง Low Stock ในสินค้าที่มี turnover ต่ำกว่าค่าเฉลี่ย',
      'แนะนำตั้ง safety stock เพิ่ม 15-20% สำหรับรายการที่ขายต่อเนื่อง',
      'ควรเร่งเคลียร์สินค้าค้างสต็อกด้วยแคมเปญ bundle หรือโปรรายสัปดาห์'
    ];
  } else if (text.includes('robot') || text.includes('battery') || text.includes('task')) {
    bullets = [
      'มีหุ่นยนต์บางตัวอยู่ในสถานะ Idle แต่แบตเตอรี่ลดต่ำลง ควรสลับคิวชาร์จ',
      'Task success สูงกว่า 90% ถือว่าอยู่ในเกณฑ์ดี แต่ควรเฝ้าดู error log ซ้ำซ้อน',
      'แนะนำทำ preventive maintenance ก่อนช่วงงานหนาแน่น'
    ];
  } else if (text.includes('campaign') || text.includes('roas') || text.includes('cac') || text.includes('marketing')) {
    bullets = [
      'แคมเปญที่ ROAS สูงควรได้รับงบเพิ่มแบบค่อยเป็นค่อยไป',
      'CAC ที่เพิ่มขึ้นอาจมาจาก audience saturation หรือ creative fatigue',
      'แนะนำ A/B test creative ใหม่และเช็ก attribution window เพิ่มเติม'
    ];
  } else if (text.includes('customer') || text.includes('sentiment') || text.includes('face') || text.includes('visitor')) {
    bullets = [
      'Sentiment เชิงบวกยังดี แต่ควรแยกตามช่วงเวลาเพื่อดู peak และ drop',
      'Repeat visitor ที่เพิ่มขึ้นสะท้อน loyalty ในบาง segment',
      'แนะนำเชื่อม facial insight กับ campaign timing เพื่อ personalize offer'
    ];
  } else if (text.includes('product') || text.includes('review') || text.includes('return')) {
    bullets = [
      'สินค้าที่คะแนนรีวิวสูงและอัตราคืนต่ำ ควรดันขึ้นหน้าแนะนำสินค้า',
      'ถ้า return rate สูงกว่าค่าเฉลี่ย ควรตรวจคำอธิบายสินค้าและคุณภาพการแพ็ก',
      'แนะนำรวมรีวิวเชิงบวกมาใช้ใน marketing asset เพื่อเพิ่ม conversion'
    ];
  } else {
    bullets = [
      'ภาพรวมระบบวันนี้อยู่ในสถานะพร้อมใช้งานและข้อมูลมีความต่อเนื่อง',
      `โมดูล ${module} ควรโฟกัสที่ KPI หลักและสิ่งผิดปกติที่เกิดขึ้นล่าสุด`,
      'ถ้าต้องการ ผมสามารถสรุปเป็น action plan, executive brief หรือ checklist ได้ทันที'
    ];
  }

  return `${intro}\n\nสรุปจากคำถาม: “${message}”\n\n- ${bullets.join('\n- ')}\n\nคำแนะนำถัดไป: ลองขอให้ AI เปรียบเทียบข้อมูลรายสัปดาห์, สรุปความเสี่ยง หรือสร้างแผนปฏิบัติการแบบผู้บริหาร`;
}

export async function generateAiResponse({ message, module, provider = 'mock' }) {
  const requested = provider || process.env.DEFAULT_AI_PROVIDER || 'mock';

  if (requested === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are OGA International enterprise AI assistant. Module: ${module}. ${moduleHints[module] || ''}\nUser question: ${message}\nRespond in Thai with concise enterprise insights and action items.`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 500 }
        })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')?.trim();
      if (text) return { text, provider: 'gemini' };
    } catch (error) {
      console.error('Gemini fallback to mock:', error.message);
    }
  }

  return { text: buildMockReply(message, module), provider: 'mock' };
}
