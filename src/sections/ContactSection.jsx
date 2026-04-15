import { useState, useRef, useEffect } from 'react'
import { submitContactForm } from '../utils/api'
import { useReveal } from '../hooks/useReveal'
import '../styles/contact.css'

const INFO = [
  {
    color: '#5182FF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    label: 'Address',
    lines: ['Char Dham Colony, Peepal Pokhra,', '1 Fatehpur, Haldwani,', 'Uttarakhand 263139'],
  },
  {
    color: '#06D6A0',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.45 18a19.45 19.45 0 0 1-6.19-6.19A19.79 19.79 0 0 1 2.12 3 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Phone',
    lines: ['+91 98765 43210', '+91 91234 56789'],
  },
  {
    color: '#8B5CF6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Email',
    lines: ['vedikalearningplace@gmail.com'],
  },
  {
    color: '#FFB700',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Study Hours',
    lines: ['5:00 AM - 11:00 PM', '7 Days a Week, All Year'],
  },
]

function FloatInput({ label, name, type = 'text', value, onChange, placeholder, required, rows }) {
  const [focus, setFocus] = useState(false)
  const active = focus || value.length > 0
  const Tag = rows ? 'textarea' : 'input'
  return (
    <div className={`fi ${active ? 'fi--up' : ''} ${focus ? 'fi--focus' : ''}`}>
      <label className="fi__label" htmlFor={`fi-${name}`}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <Tag
        id={`fi-${name}`}
        className="fi__input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={focus ? placeholder : ''}
        required={required}
        rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoComplete={
          name === 'email' ? 'email' :
          name === 'phone' ? 'tel' :
          name === 'name'  ? 'name' : 'off'
        }
      />
      <div className="fi__bar" aria-hidden="true"/>
    </div>
  )
}

export default function ContactSection({ fullPage }) {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const ref = useReveal()

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await submitContactForm(form)
      setStatus({ ok: true, msg: 'Message sent! We will confirm over email shortly.' })
      setForm({ name: '', email: '', phone: '', message: '' })
      setSent(true)
    } catch {
      setStatus({ ok: false, msg: 'Something went wrong. Please call us directly.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className={`con ${fullPage ? 'con--full' : ''}`} ref={ref}>
      <div className="con__bg-grid" aria-hidden="true"/>
      <div className="con__orb con__orb--1" aria-hidden="true"/>
      <div className="con__orb con__orb--2" aria-hidden="true"/>

      <div className="con__wrap">

        <header className="s-head">
          <div className="s-badge">
            <span className="s-badge-dot"/>
            Get In Touch
          </div>
          <h2 className="s-title">
            Start Your Journey<br/><em>Today</em>
          </h2>
          <p className="s-sub">
            We would love to help you find your perfect study slot at Vedika.
          </p>
        </header>

        <div className="con__layout">

          <aside className="con__left">
            <div className="con__info-card">
              {INFO.map((item, i) => (
                <div className="con__info-row" key={i} style={{ '--ic': item.color }}>
                  <div className="con__info-icon">{item.icon}</div>
                  <div className="con__info-body">
                    <h4 className="con__info-label">{item.label}</h4>
                    {item.lines.map((l, j) => (
                      <p key={j} className="con__info-line">{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="con__quick-stats">
              {[
                { val: '< 1hr', lbl: 'Response Time' },
                { val: '18hr',  lbl: 'Open Daily' },
                { val: 'Free',  lbl: 'Site Visit' },
              ].map((s, i) => (
                <div key={i} className="con__qstat">
                  <span className="con__qstat-val">{s.val}</span>
                  <span className="con__qstat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>

            <div className="con__map">
              <div className="con__map-label" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#5182FF"/>
                </svg>
                Haldwani, Uttarakhand
              </div>
              {/* Correct coordinates: Haldwani city center, Nainital district, Uttarakhand */}
              <iframe
  title="Vedika Learning Place Location"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3481.5603851079636!2d79.44618647540405!3d29.236482775340427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a09d8bb565c43b%3A0xdcc8606ae28d0e34!2sVedika%20Learning%20Place%20%26%20Library!5e0!3m2!1sen!2sin!4v1775971143180!5m2!1sen!2sin"
  width="100%"
  height="220"
  style={{ border: 0, display: 'block' }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
            </div>
          </aside>

          <div className="con__form-box">
            <div className="con__form-topbar" aria-hidden="true"/>

            <div className="con__form-header">
              <h3 className="con__form-title">Send a Message</h3>
            </div>

            {sent ? (
              <div className="con__success-state" role="status" aria-live="polite">
                <div className="con__success-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(0,212,138,0.15)"/>
                    <path d="M7 12l3.5 3.5L17 9" stroke="#00D48A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>Message Received!</h4>
                <p>We will reach out within the hour.</p>
                <button className="con__resend" onClick={() => { setSent(false); setStatus(null) }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="con__form" onSubmit={submit} noValidate>
                <div className="con__row">
                  <FloatInput label="Full Name" name="name"  value={form.name}  onChange={set} placeholder="Your name"         required/>
                  <FloatInput label="Phone"     name="phone" type="tel" value={form.phone} onChange={set} placeholder="+91 XXXXX XXXXX"/>
                </div>
                <FloatInput label="Email Address" name="email" type="email" value={form.email} onChange={set} placeholder="you@email.com" required/>
                <FloatInput label="Message" name="message" value={form.message} onChange={set} placeholder="Tell us about your exam goals..." required rows={5}/>

                {status && !status.ok && (
                  <div className="con__status con__status--err" role="alert">{status.msg}</div>
                )}

                <button type="submit" className="con__submit" disabled={loading}>
                  {loading ? (
                    <><span className="con__spin" aria-hidden="true"/> Sending...</>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}