import { motion } from 'framer-motion'
import { Bell, LogOut, ToggleRight, CalendarDays, ExternalLink } from 'lucide-react'
import { mockUser, mockTransactions } from '../data/mockData'
import { useDark } from '../hooks/useDark'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.32 } }
}

const initials = mockUser.name
  .split(' ')
  .map(n => n[0])
  .join('')
  .slice(0, 2)

const monthsTracked = 2
const txCount = mockTransactions.length

// Next scheduled Money Mentors meeting
const nextMeeting = {
  date: 'Thursday, Apr 17, 2026',
  time: '2:00 PM',
  location: 'Building 42, Room 309',
}

const BOOKINGS_URL = 'https://outlook.office.com/book/GCUMoneyMentors1@gcu.edu/'

export default function Profile() {
  const dark = useDark()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: "calc(64px + env(safe-area-inset-top))", paddingBottom: 96 }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 16px' }}
      >

        {/* Avatar card */}
        <motion.div
          variants={item}
          style={{
            background: 'var(--surface)',
            boxShadow: '0 4px 20px var(--shadow-md)',
            borderRadius: 22,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px 16px',
          }}
        >
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4B2683 0%, #6B3FA0 100%)',
            color: '#FFC423',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700,
            marginBottom: 16,
          }}>
            {initials}
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{mockUser.name}</p>
          <p style={{ fontSize: 14, marginTop: 2, color: 'var(--text-label)' }}>{mockUser.email}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <span style={{
              fontSize: 12, fontWeight: 500,
              padding: '4px 12px', borderRadius: 100,
              background: 'var(--surface-elevated)',
              color: 'var(--purple-interactive)',
            }}>
              {mockUser.major}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 500,
              padding: '4px 12px', borderRadius: 100,
              background: dark ? 'rgba(243,156,18,0.15)' : '#FFF8E1',
              color: '#F39C12',
            }}>
              {mockUser.year}
            </span>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Months Tracked', value: monthsTracked },
            { label: 'Transactions',   value: txCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: 'var(--surface)',
                boxShadow: '0 4px 20px var(--shadow-md)',
                borderRadius: 22,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--purple-interactive)' }}>{value}</p>
              <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Money Mentors card */}
        <motion.div
          variants={item}
          style={{
            background: 'var(--surface)',
            boxShadow: '0 4px 20px var(--shadow-md)',
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <div style={{
            background: 'linear-gradient(135deg, #4B2683 0%, #6B3FA0 100%)',
            padding: '16px 18px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <CalendarDays size={18} color="#FFC423" />
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Money Mentors</p>
          </div>

          {/* Meeting details */}
          <div style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
              Next Meeting
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{nextMeeting.date}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{nextMeeting.time} · {nextMeeting.location}</p>
            </div>

            {/* Book Now button */}
            <a
              href={BOOKINGS_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                width: '100%',
                padding: '13px 0',
                borderRadius: 16,
                background: '#FFC423',
                color: '#4B2683',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              Book Now
              <ExternalLink size={14} strokeWidth={2.5} />
            </a>
          </div>
        </motion.div>

        {/* Settings list */}
        <motion.div
          variants={item}
          style={{
            background: 'var(--surface)',
            boxShadow: '0 4px 20px var(--shadow-md)',
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          {[
            { icon: ToggleRight, label: 'Budget Mode', value: 'Income-based' },
            { icon: Bell,        label: 'Notifications', value: 'On' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderBottom: '1px solid var(--table-row-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={18} style={{ color: 'var(--purple-interactive)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{label}</span>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{value}</span>
            </div>
          ))}

          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 18px', width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#E74C3C',
            }}
          >
            <LogOut size={18} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Sign Out</span>
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={item}
          style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', paddingBottom: 8 }}
        >
          GMM Budget · Faith Finance Fellowship
        </motion.p>

      </motion.div>
    </div>
  )
}
