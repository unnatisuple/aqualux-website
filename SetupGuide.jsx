import { CheckCircle, ExternalLink, AlertTriangle, Info, Zap, ShoppingBag, Mail, Globe } from 'lucide-react';

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-aqua text-white flex items-center justify-center font-black text-sm">
        {number}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="font-bold text-navy mb-3">{title}</h3>
        <div className="text-sm text-slate space-y-2 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function CheckItem({ children }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function WarnItem({ children }) {
  return (
    <div className="flex items-start gap-2">
      <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function InfoBox({ title, children, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      {title && <p className="font-semibold mb-2">{title}</p>}
      <div className="text-sm space-y-1">{children}</div>
    </div>
  );
}

export default function SetupGuide() {
  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="admin-card bg-gradient-to-br from-navy to-navy-700 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-aqua/20 flex items-center justify-center">
            <Zap size={20} className="text-aqua" />
          </div>
          <div>
            <h1 className="text-xl font-black">AquaLux Business Setup Guide</h1>
            <p className="text-white/60 text-sm">Complete this guide to go live with your store</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { val: '3', label: 'Main Steps' },
            { val: '~30 min', label: 'Setup Time' },
            { val: '100%', label: 'Production Ready' },
          ].map((s, i) => (
            <div key={i} className="glassmorphism rounded-xl p-3 text-center">
              <p className="text-lg font-black text-aqua">{s.val}</p>
              <p className="text-white/60 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 1: Razorpay */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-aqua/10 flex items-center justify-center">
            <ShoppingBag size={18} className="text-aqua" />
          </div>
          <h2 className="font-black text-navy">1. Razorpay Payment Gateway Setup</h2>
        </div>

        <div className="relative pl-0">
          <div className="absolute left-4.5 top-9 bottom-9 w-0.5 bg-gray-100" />
          <Step number="1" title="Create Your Razorpay Account">
            <p>Visit <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline inline-flex items-center gap-1">razorpay.com <ExternalLink size={12} /></a> and sign up for a business account.</p>
            <CheckItem>Click "Sign Up" and choose "Business Account"</CheckItem>
            <CheckItem>Enter your business details: business name, type, PAN, GST</CheckItem>
            <CheckItem>Upload required documents (Bank statement, address proof)</CheckItem>
          </Step>

          <Step number="2" title="Complete KYC Verification">
            <InfoBox title="⚠ Important" color="amber">
              <p>KYC is mandatory before receiving live payments. It typically takes 2–5 business days.</p>
            </InfoBox>
            <CheckItem>Go to Account → KYC in your Razorpay dashboard</CheckItem>
            <CheckItem>Submit business PAN, GST certificate, and bank details</CheckItem>
            <CheckItem>Verify your bank account via NEFT penny drop</CheckItem>
          </Step>

          <Step number="3" title="Get Your API Keys">
            <CheckItem>In Razorpay Dashboard → Settings → API Keys</CheckItem>
            <CheckItem>Click "Generate Test Key" to get your test credentials</CheckItem>
            <CheckItem>Note your <strong>Key ID</strong> (starts with <code className="text-aqua bg-aqua/5 px-1 rounded">rzp_test_</code>)</CheckItem>
            <WarnItem>Never expose your Key Secret on the frontend. Use it server-side only.</WarnItem>
          </Step>

          <Step number="4" title="Add Key to Admin Settings">
            <p>Go to <strong>Admin → Settings → Razorpay Key ID</strong> and paste your Key ID.</p>
            <InfoBox color="green">
              <p>✓ The key is stored in your browser's localStorage and injected into every payment call.</p>
            </InfoBox>
          </Step>
        </div>
      </div>

      {/* Section 2: Going Live */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
            <Globe size={18} className="text-green-600" />
          </div>
          <h2 className="font-black text-navy">2. Going Live Checklist</h2>
        </div>

        <div className="space-y-3">
          {[
            { text: 'Replace rzp_test_ key with rzp_live_ key in Admin → Settings', done: false },
            { text: 'Set up Razorpay Webhook for payment confirmation (Dashboard → Webhooks)', done: false },
            { text: 'Implement server-side order creation for signature verification', done: false },
            { text: 'Connect a real email service (EmailJS, SendGrid, or SMTP) for order emails', done: false },
            { text: 'Update store name, logo, and address in Admin → Settings', done: false },
            { text: 'Test a full order flow: add to cart → checkout → payment → order success', done: false },
            { text: 'Test COD flow and ensure orders appear in Admin → Orders', done: false },
            { text: 'Verify Razorpay Dashboard shows successful test transactions', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-warm-100 rounded-xl">
              <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5" />
              <span className="text-sm text-navy">{item.text}</span>
            </div>
          ))}
        </div>

        <InfoBox title="Razorpay Webhook Setup" color="blue">
          <CheckItem>Dashboard → Webhooks → Add New Webhook</CheckItem>
          <CheckItem>URL: <code>https://yourdomain.com/api/razorpay/webhook</code></CheckItem>
          <CheckItem>Events to subscribe: <code>payment.captured</code>, <code>payment.failed</code></CheckItem>
        </InfoBox>
      </div>

      {/* Section 3: COD Management */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <ShoppingBag size={18} className="text-amber-600" />
          </div>
          <h2 className="font-black text-navy">3. Cash on Delivery (COD) Management</h2>
        </div>

        <div className="space-y-3">
          <InfoBox color="amber">
            <p>COD orders appear in <strong>Admin → Orders</strong> with status <code>"COD - Pending"</code>.</p>
          </InfoBox>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Identifying COD Orders', steps: ['Go to Admin → Orders', 'Filter by "COD - Pending"', 'Note the customer address and items ordered'] },
              { title: 'Marking as Delivered', steps: ['Open the order detail', 'Change status to "Delivered"', 'Click "Save Status" — order updates in real-time'] },
              { title: 'Setting COD Rules', steps: ['Go to Admin → Settings', 'Toggle "Enable COD" on/off', 'Set COD fee (default ₹99)', 'COD is auto-disabled for orders over ₹25,000'] },
              { title: 'COD vs Online Payments', steps: ['Online: Revenue instantly in Razorpay → Bank', 'COD: Revenue collected by delivery partner', 'Track pending COD in Payments → COD Pending'] },
            ].map((card, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <p className="font-semibold text-navy text-sm mb-2">{card.title}</p>
                {card.steps.map((s, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs text-slate">
                    <span className="text-aqua font-bold">{j + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Email */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
            <Mail size={18} className="text-purple-600" />
          </div>
          <h2 className="font-black text-navy">4. Order Confirmation Emails</h2>
        </div>
        <InfoBox color="blue">
          <p>The current implementation uses client-side only. To send real order emails, integrate one of the following:</p>
        </InfoBox>
        <div className="mt-3 space-y-2">
          {[
            { name: 'EmailJS', url: 'emailjs.com', desc: 'Free tier available, easy React integration, no backend needed', badge: 'Recommended' },
            { name: 'SendGrid', url: 'sendgrid.com', desc: '100 emails/day free, professional SMTP, requires backend API', badge: '' },
            { name: 'Nodemailer + Express', url: '', desc: 'Full control with your own server, use Gmail or SMTP relay', badge: '' },
          ].map((opt, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-navy text-sm">{opt.name}</p>
                  {opt.badge && <span className="badge-green text-xs">{opt.badge}</span>}
                </div>
                <p className="text-xs text-slate">{opt.desc}</p>
              </div>
              {opt.url && (
                <a href={`https://${opt.url}`} target="_blank" rel="noopener noreferrer"
                  className="text-aqua hover:text-aqua-700 flex-shrink-0">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Note */}
      <div className="admin-card bg-gradient-to-br from-aqua/5 to-aqua/10 border-2 border-aqua/20">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-aqua mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-navy mb-1">Need Technical Help?</h3>
            <p className="text-sm text-slate leading-relaxed">
              This platform is built with React + Vite + Tailwind CSS. For production, you'll need a backend server 
              (Node.js/Express or Next.js API routes) for Razorpay signature verification, email sending, 
              and persistent database storage (MongoDB, PostgreSQL, or Firebase).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
