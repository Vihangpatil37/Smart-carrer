import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useInView,
  useMotionValue,
  animate,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import {
  Menu,
  X,
  User,
  ClipboardList,
  Brain,
  Sparkles,
  Map,
  MessageSquare,
  FileText,
  BarChart2,
  GraduationCap,
  Target,
  Users,
  Zap,
  Mail,
  ArrowRight,
  Eye,
  Code2,
  Activity,
  Palette,
  Award,
  Cpu,
  Compass,
  Layers,
  Shield,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionReveal } from '../components/shared/SectionReveal';
import { fadeUp, staggerContainer, scaleIn } from '../lib/motion';

/* ── AnimatedCounter ───────────────────────────── */
function AnimatedCounter({
  from = 0,
  to,
  duration = 1.5,
  suffix = '',
  prefix = '',
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(from);
  const count = useMotionValue(from);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, count, to, duration]);

  useEffect(() => {
    return count.on('change', (latest) => setDisplayValue(Math.round(latest)));
  }, [count]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── CareerOrbit ────────────────────────────────── */
interface OrbitChipData {
  label: string;
  angle: number;
  reverse?: boolean;
  categoryColor: string;
  icon: typeof Brain;
}

const ORBIT_INNER_CHIPS: OrbitChipData[] = [
  { label: 'Software Engineer', angle: 0, categoryColor: '#3B82F6', icon: Code2 },
  { label: 'Medical Researcher', angle: 60, categoryColor: '#22C55E', icon: Activity },
  { label: 'UX Designer', angle: 120, categoryColor: '#F97316', icon: Palette },
  { label: 'IAS Officer', angle: 180, categoryColor: '#94A3B8', icon: Award },
  { label: 'Data Scientist', angle: 240, categoryColor: '#8B5CF6', icon: Cpu },
  { label: 'Pilot', angle: 300, categoryColor: '#EF4444', icon: Compass },
];

const ORBIT_OUTER_CHIPS: OrbitChipData[] = [
  { label: 'Architect', angle: 0, categoryColor: '#06B6D4', icon: Layers, reverse: true },
  { label: 'Defense Officer', angle: 90, categoryColor: '#DC2626', icon: Shield, reverse: true },
  { label: 'Cybersecurity', angle: 180, categoryColor: '#3B82F6', icon: Lock, reverse: true },
  { label: 'Creative Director', angle: 270, categoryColor: '#EC4899', icon: Sparkles, reverse: true },
];

const CareerOrbit = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="orbit-container relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] lg:w-[480px] lg:h-[480px] mx-auto lg:ml-auto lg:mr-0 flex items-center justify-center select-none mb-10 lg:mb-0"
    >
      {/* Central Ambient Energy Glow */}
      <div className="absolute w-48 h-48 rounded-full bg-brand/20 blur-[60px] pointer-events-none" />

      {/* Orbit Track 1 (Inner) - Static circular guide */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] rounded-full border border-brand/20 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 24px rgba(91, 124, 250, 0.08), 0 0 20px rgba(91, 124, 250, 0.05)',
        }}
      />

      {/* Orbit Track 2 (Outer) - Static dashed guide */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[410px] sm:h-[410px] rounded-full border border-dashed border-white/[0.08] pointer-events-none hidden sm:block"
      />

      {/* Central AI Core Hub */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none">
        {/* Pulsing Outer Energy Wave */}
        <motion.div
          animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-ai-cyan/30"
        />
        {/* Rotating Dashed Compass Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-ai-cyan/25"
        />
        {/* Core Hub Center */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0A0A0F]/95 border border-brand/45 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(91,124,250,0.35)] backdrop-blur-xl">
          <Brain className="h-8 w-8 sm:h-9 sm:w-9 text-brand drop-shadow-[0_0_12px_rgba(91,124,250,0.8)]" />
          <span className="text-[9px] font-mono tracking-widest text-ai-cyan font-semibold mt-1">
            AI CORE
          </span>
        </div>
      </div>

      {/* Orbiting Inner Ring Chips */}
      {ORBIT_INNER_CHIPS.map((chip) => (
        <OrbitChip key={chip.label} {...chip} />
      ))}

      {/* Orbiting Outer Ring Chips (Desktop & Tablet) */}
      <div className="hidden sm:contents">
        {ORBIT_OUTER_CHIPS.map((chip) => (
          <OrbitChip key={chip.label} {...chip} />
        ))}
      </div>

      {/* Floating Live Match Insight Badge */}
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 sm:left-2 sm:translate-x-0 z-30 pointer-events-auto"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0A0A0F]/95 border border-brand/35 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.7)]">
          <div className="w-6 h-6 rounded-lg bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <Sparkles className="h-3.5 w-3.5 text-ai-cyan" />
          </div>
          <div className="flex flex-col text-left">
            <div className="text-[10px] text-text-muted font-medium">Smart AI Matching</div>
            <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <span>96% Pathway Match</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

function OrbitChip({
  label,
  angle,
  reverse,
  categoryColor,
  icon: Icon,
}: OrbitChipData) {
  const animationDelay = reverse
    ? `-${(((360 - angle) % 360) / 360) * 38}s`
    : `-${(angle / 360) * 28}s`;

  return (
    <div
      className={`absolute top-1/2 left-1/2 pointer-events-auto ${
        reverse ? 'orbit-chip-outer' : 'orbit-chip-inner'
      }`}
      style={{
        animationDelay,
      }}
    >
      <div
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0A0F]/95 border border-white/[0.12] hover:border-white/40 backdrop-blur-md whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{
          borderColor: `${categoryColor}50`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
          style={{ backgroundColor: categoryColor, boxShadow: `0 0 8px ${categoryColor}` }}
        />
        <Icon className="h-3 w-3 shrink-0" style={{ color: categoryColor }} />
        <span className="text-[0.72rem] font-medium text-text-primary group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ── Landing Page ──────────────────────────────── */
export function Landing() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewStep, setPreviewStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play preview steps
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Journey', href: '#journey' },
    { label: 'Careers', href: '#careers' },
    { label: 'Preview Flow', href: '#preview' },
  ];


  /* ── Stat data ────────────────── */
  const stats = [
    { value: 150, suffix: '+', label: 'Careers Catalog' },
    { value: 5000, suffix: '+', label: 'Student Checks' },
    { value: 100, suffix: '%', label: 'Free Guidance' },
    { value: 24, suffix: '/7', label: 'AI Mentor Support' },
  ];

  /* ── Journey steps ────────────── */
  const journeySteps = [
    { id: '1', title: 'Create Profile', desc: 'Tell us about your background, stream, and class.', icon: User },
    { id: '2', title: 'Take Assessment', desc: 'A quick 20-question interest and academic assessment.', icon: ClipboardList },
    { id: '3', title: 'AI Matching Engine', desc: 'Our recommendation engine aligns interests and stream constraints.', icon: Brain },
    { id: '4', title: 'Receive Recommendations', desc: 'Get matched careers with detailed confidence scores and analyses.', icon: Sparkles },
    { id: '5', title: 'Explore Roadmaps', desc: 'See step-by-step actions, key exams, and required skills.', icon: Map },
    { id: '6', title: 'Discuss with AI Mentor', desc: 'Get instant answers, clear doubts, and refine choices.', icon: MessageSquare },
  ];

  /* ── Career data ─────────────── */
  const careers = [
    { title: 'Software Engineer', salary: '₹8L–₹40L', demand: 'Very High', growth: '↑ 22%/yr', color: '#3B82F6' },
    { title: 'Medical Researcher', salary: '₹6L–₹25L', demand: 'High', growth: '↑ 15%/yr', color: '#22C55E' },
    { title: 'UX Designer', salary: '₹6L–₹22L', demand: 'High', growth: '↑ 18%/yr', color: '#F97316' },
    { title: 'Data Scientist', salary: '₹10L–₹35L', demand: 'Very High', growth: '↑ 28%/yr', color: '#8B5CF6' },
    { title: 'IAS Officer', salary: '₹7L–₹18L', demand: 'Stable', growth: '→ Prestige', color: '#64748B' },
    { title: 'Commercial Pilot', salary: '₹15L–₹80L', demand: 'Growing', growth: '↑ 12%/yr', color: '#DC2626' },
    { title: 'Cybersecurity Analyst', salary: '₹8L–₹30L', demand: 'Critical', growth: '↑ 32%/yr', color: '#3B82F6' },
    { title: 'Agronomist', salary: '₹4L–₹12L', demand: 'Moderate', growth: '↑ 8%/yr', color: '#84CC16' },
  ];

  /* ── Features data (Asymmetric Grid) ───────────── */
  const features = [
    { icon: Brain, title: 'ML-Powered Recommendation Engine', desc: 'State-of-the-art matching models trained on real academic and interest profiles to score and rank career matches with zero bias.' },
    { icon: Sparkles, title: 'Empathy-Driven AI Mentor', desc: 'Talk to Career Mentor AI 24/7. It provides constructive feedback and structural explanations of your scores.' },
    { icon: Map, title: 'Actionable Career Roadmaps', desc: 'Discover exact steps: study guides, critical entrance exams, key skills, and timeline estimates.' },
    { icon: FileText, title: 'Detailed Match Explanations', desc: 'No generic suggestions. Understand the "why" with score breakdowns across Interest, Academic suitability, and Skill gaps.' },
    { icon: GraduationCap, title: 'College & Stream Pathways', desc: 'Know exactly which streams and colleges unlock each career path.' },
    { icon: BarChart2, title: 'Dynamic Analytics', desc: 'Interactive tracking of your history, assessment updates, and learning progress.' },
  ];

  /* ── Stories ──────────────────── */
  const stories = [
    { avatar: '👩🏽‍💻', name: 'Priya S.', location: 'Mumbai', stream: 'PCM', recommendation: 'Software Engineer', quote: 'SCPR showed me exactly why engineering suits my thinking style.' },
    { avatar: '👨🏻‍⚕️', name: 'Rahul M.', location: 'Delhi', stream: 'PCB', recommendation: 'Medical Research', quote: 'The roadmap section gave me a clear plan I could show my parents.' },
    { avatar: '👩🏾‍🎨', name: 'Ananya K.', location: 'Bengaluru', stream: 'Arts', recommendation: 'UX Designer', quote: 'I never knew UX Design existed until SCPR recommended it.' },
    { avatar: '👨🏼‍💼', name: 'Arjun T.', location: 'Pune', stream: 'Commerce', recommendation: 'Data Analyst', quote: 'The AI counselor helped me convince my family about my career choice.' },
  ];

  /* ── About cards ──────────────── */
  const aboutCards = [
    { icon: Target, title: 'Precision Match Scoring', desc: 'Sophisticated algorithms process Stream Suitability, Personal Interests, and Skill alignment with transparent scoring.' },
    { icon: Users, title: 'Empathetic AI Persona', desc: 'Career Mentor AI listens, explains findings, and suggests practical steps, helping students make informed choices.' },
    { icon: Zap, title: '100% Free Guidance', desc: 'Full access to assessments, AI chat, catalogs, and roadmaps. Dedicated to empowering Indian students without financial barriers.' },
  ];

  /* ── Journey scroll timeline ──── */
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollPercent, setScrollPercent] = useState(0);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start center', 'end center'] });
  const sparkY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * journeySteps.length);
    setActiveIndex(Math.min(index, journeySteps.length - 1));
    setScrollPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
  });

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary overflow-hidden font-geist">
      {/* ── NAVBAR (Almost disappears, clean glass) ── */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-350 ${
          scrolled
            ? 'bg-[#05070D]/75 backdrop-blur-[25px] border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.30)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <a href="/" className="font-anton text-[1.5rem] text-brand tracking-wider focus-ring rounded">
              SCPR
            </a>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-medium text-sm text-text-secondary hover:text-text-primary transition-colors duration-180 focus-ring rounded"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
            <button
              className="md:hidden text-brand p-2 focus-ring rounded"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-[#0A0A0F] z-[70] shadow-2xl flex flex-col p-6 md:hidden border-l border-white/[0.08]"
            >
              <div className="flex justify-end mb-8">
                <button
                  className="text-text-secondary hover:text-text-primary focus-ring rounded p-2"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-6 flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-medium text-lg text-text-secondary hover:text-text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col space-y-4 mt-auto">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full text-center"
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO (Enhanced aurora ambient lighting & depth) ── */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-24 lg:pt-28 pb-12 lg:pb-16 overflow-hidden bg-[#05070D]">
        {/* Ambient Aurora Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-Right Cyan/Brand Aurora */}
          <div className="absolute -top-[10%] right-[-5%] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(91,124,250,0.18)_0%,rgba(112,225,255,0.08)_40%,transparent_70%)] blur-[90px]" />
          {/* Center-Left Violet/Indigo Glow */}
          <div className="absolute top-[20%] -left-[10%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.14)_0%,rgba(91,124,250,0.06)_45%,transparent_70%)] blur-[100px]" />
          {/* Subtle Center Depth Beam */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(91,124,250,0.08)_0%,transparent_70%)] blur-[110px]" />
          {/* Fine Technical Grid with Radial Vignette Falloff */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-14">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-md shadow-[0_0_20px_rgba(91,124,250,0.15)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ai-cyan" />
              </span>
              <span className="text-[0.72rem] sm:text-xs font-semibold tracking-wider text-brand uppercase">
                Free AI Career Counseling Platform
              </span>
            </motion.div>
            <h1 className="font-plus-jakarta font-semibold text-[clamp(2rem,6vw,4.2rem)] leading-[1.08] tracking-tight text-text-primary mb-5">
              Empathetic AI Mentorship for Students
            </h1>
            <p className="text-base sm:text-lg text-text-secondary mb-7 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Unlock personalized path recommendations based on academic strengths and interests. Created exclusively for Indian Class 10 & 12 students.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6"
            >
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold shadow-[0_0_30px_rgba(91,124,250,0.35)] hover:shadow-[0_0_40px_rgba(91,124,250,0.55)] transition-all duration-300"
              >
                Start Assessment <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <a
                href="#careers"
                className="w-full sm:w-auto font-semibold text-text-primary bg-white/[0.04] border border-white/[0.12] hover:border-brand/40 hover:bg-white/[0.08] px-8 py-3.5 rounded-[18px] transition-all duration-300 flex items-center justify-center gap-2 text-base focus-ring backdrop-blur-sm"
              >
                Explore Careers <Eye className="h-4 w-4" />
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-text-muted"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>CBSE • ICSE • State Boards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                <span>150+ Career Catalog</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ai-cyan" />
                <span>100% Free Guidance</span>
              </div>
            </motion.div>
          </div>
          <div className="flex-grow w-full lg:max-w-[48%] flex justify-center items-center">
            <CareerOrbit />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="w-full bg-white/[0.02] border-y border-white/[0.06] py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/[0.06]">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center ${idx > 0 ? 'pl-8 md:pl-0' : ''} ${
                  idx % 2 === 0 ? 'md:border-none' : ''
                } ${idx >= 2 ? 'md:border-l' : ''}`}
              >
                <div className="font-plus-jakarta font-bold text-2xl sm:text-3xl text-brand tracking-tight mb-2">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-text-secondary text-xs sm:text-sm text-center font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── JOURNEY ── */}
      <section id="journey" className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Spatial Lighting for Deep Architectural Look */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[12%] -left-[10%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(91,124,250,0.12)_0%,transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(112,225,255,0.08)_0%,transparent_70%)] blur-[110px]" />
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] blur-[120px]" />
        </div>

        <SectionReveal className="text-center mb-10 sm:mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand/25 bg-brand/10 backdrop-blur-md mb-4 text-xs font-semibold text-brand tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-ai-cyan" />
            <span>6-Stage Discovery Framework</span>
          </div>
          <h2 className="font-plus-jakarta font-bold text-[clamp(2rem,5vw,3.5rem)] text-text-primary tracking-tight">
            THE GUIDANCE JOURNEY
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
            From self-reflection to actionable execution — structured step-by-step career navigation.
          </p>
        </SectionReveal>

        {/* High-Tech dApp Telemetry HUD Scroll Progress Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between max-w-md mx-auto mb-14 px-5 py-2.5 rounded-full bg-[#0A0A0F]/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ai-cyan" />
            </span>
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
              {activeIndex >= 0 ? `Stage 0${activeIndex + 1} of 06 Active` : 'Scroll to Explore Pathway'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-24 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand via-ai-cyan to-brand transition-all duration-150"
                style={{ width: `${Math.max(10, scrollPercent)}%` }}
              />
            </div>
            <span className="font-mono text-[11px] font-bold text-ai-cyan">
              {scrollPercent}%
            </span>
          </div>
        </div>

        <div ref={timelineRef} className="relative z-10">
          {/* Illuminated Cyber Spine Rail */}
          <div className="absolute left-[24px] lg:left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.07] -translate-x-1/2 rounded-full overflow-hidden shadow-[0_0_12px_rgba(91,124,250,0.15)]">
            <motion.div
              className="w-full bg-gradient-to-b from-brand via-ai-cyan to-brand origin-top shadow-[0_0_16px_rgba(112,225,255,0.7)]"
              style={{ scaleY: scrollYProgress }}
            />
          </div>

          {/* Traveling Laser Spark Comet Head Following Scroll Position */}
          <motion.div
            style={{ top: sparkY }}
            className="absolute left-[24px] lg:left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-ai-cyan shadow-[0_0_16px_#70E1FF,0_0_32px_#5B7CFA] pointer-events-none z-30 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
          </motion.div>

          <div className="flex flex-col gap-12 sm:gap-14">
            {journeySteps.map((step, index) => {
              const isActive = index <= activeIndex;
              return (
                <div key={step.id} className="relative flex justify-start lg:justify-center w-full">
                  {/* Concentric Architectural Milestone Beacon */}
                  <div
                    className={`absolute left-[24px] lg:left-1/2 top-7 -translate-x-1/2 w-8 h-8 rounded-full border z-20 flex items-center justify-center transition-all duration-300 backdrop-blur-xl ${
                      isActive
                        ? 'border-brand/80 bg-[#05070D] shadow-[0_0_24px_rgba(91,124,250,0.7)] ring-2 ring-brand/35'
                        : 'border-white/[0.12] bg-[#0A0A0F]/90'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold transition-colors ${
                        isActive ? 'text-ai-cyan' : 'text-text-muted'
                      }`}
                    >
                      0{step.id}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="pulse"
                        className="absolute inset-0 rounded-full border border-ai-cyan/60"
                        animate={prefersReducedMotion ? {} : { scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </div>

                  {/* Desktop Horizontal Circuit Trace Connector */}
                  <div
                    className={`hidden lg:block absolute top-[43px] w-14 h-[1px] transition-all duration-500 ${
                      index % 2 === 0
                        ? 'right-1/2 mr-4 bg-gradient-to-l'
                        : 'left-1/2 ml-4 bg-gradient-to-r'
                    } ${
                      isActive
                        ? 'from-ai-cyan via-brand to-transparent shadow-[0_0_10px_#70E1FF]'
                        : 'from-white/[0.08] to-transparent'
                    }`}
                  />

                  {/* Step Card Container */}
                  <div
                    className={`w-full pl-14 sm:pl-16 lg:pl-0 flex ${
                      index % 2 === 0 ? 'lg:justify-end lg:pr-12' : 'lg:justify-start lg:pl-12'
                    }`}
                  >
                    <motion.div variants={fadeUp} className="relative z-10 w-full lg:w-1/2">
                      <GlassCard
                        elevation={2}
                        className={`transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden rounded-[24px] border ${
                          isActive
                            ? 'bg-[#0A0A0F]/95 border-brand/40 shadow-[0_16px_40px_rgba(91,124,250,0.22)]'
                            : 'border-white/[0.08] hover:border-white/20 bg-[#0A0A0F]/70'
                        }`}
                      >
                        {/* Top Laser Accent Beam on Active Card */}
                        {isActive && (
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-ai-cyan to-transparent animate-pulse" />
                        )}

                        {/* Ambient Corner Light Wash */}
                        <div
                          className={`absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none transition-opacity duration-500 blur-[50px] ${
                            isActive
                              ? 'bg-brand/15 opacity-100'
                              : 'bg-transparent opacity-0 group-hover:opacity-60 group-hover:bg-brand/10'
                          }`}
                        />

                        {/* Background Architectural Ghost Numeral */}
                        <div className="absolute right-4 bottom-2 font-mono text-6xl font-black text-white/[0.025] select-none pointer-events-none tracking-tighter">
                          0{step.id}
                        </div>

                        <div className="flex items-start gap-4 sm:gap-5 p-6 sm:p-7 relative z-10">
                          {/* Elevated Double-Rim Icon Medallion */}
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                              isActive
                                ? 'bg-brand/15 border-brand/40 shadow-[0_0_20px_rgba(91,124,250,0.3)] text-brand'
                                : 'bg-white/[0.04] border-white/[0.08] group-hover:bg-brand/10 group-hover:border-brand/20 text-brand'
                            }`}
                          >
                            <step.icon
                              size={24}
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[0.68rem] font-mono uppercase tracking-wider font-semibold">
                                <span>STAGE 0{step.id}</span>
                              </div>
                              {isActive && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ai-cyan/15 border border-ai-cyan/35 text-ai-cyan text-[0.65rem] font-mono font-semibold tracking-wider animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-ai-cyan" />
                                  <span>IN FOCUS</span>
                                </div>
                              )}
                            </div>
                            <h3 className="font-plus-jakarta font-bold text-text-primary text-lg sm:text-xl mb-2 tracking-tight">
                              {step.title}
                            </h3>
                            <p className="text-text-secondary text-sm sm:text-[0.92rem] leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LIVE INTERACTIVE PIPELINE (Student → AI → Recommendation → Roadmap) ── */}
      <section id="preview" className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.06]">
        <SectionReveal className="text-center mb-12">
          <h2 className="font-plus-jakarta font-bold text-[clamp(2rem,5vw,3.5rem)] text-text-primary tracking-tight mb-4">
            HOW IT WORKS
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Experience the unified pipeline from input to detailed career roadmap in real-time.
          </p>
        </SectionReveal>

        {/* Pipeline Steps Selector */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {['1. Student Profile', '2. AI Mentor Analysis', '3. Score Match Result', '4. Custom Roadmap'].map(
            (label, idx) => (
              <button
                key={idx}
                onClick={() => setPreviewStep(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border border-solid transition-all duration-180 ${
                  previewStep === idx
                    ? 'bg-brand/10 border-brand text-brand shadow-[0_0_15px_rgba(91,124,250,0.15)]'
                    : 'bg-transparent border-white/[0.06] text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Pipeline Card Display */}
        <div className="relative w-full min-h-[380px]">
          <AnimatePresence mode="wait">
            {previewStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard elevation={2} className="p-8 border border-solid rounded-[24px]">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-brand" />
                    <h3 className="text-lg font-bold text-text-primary">Step 1: Student Profile Input</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Students input their academic background, interests, and subjects. No complex forms.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-[18px]">
                      <span className="text-xs text-text-secondary block mb-1">Academic Stream</span>
                      <span className="text-sm font-semibold text-text-primary">Class 12th — Science (PCM)</span>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-[18px]">
                      <span className="text-xs text-text-secondary block mb-1">Passions & Hobbies</span>
                      <span className="text-sm font-semibold text-text-primary">Visual Design, Technology, Building Software</span>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-[18px] sm:col-span-2">
                      <span className="text-xs text-text-secondary block mb-1">Student Goal Statement</span>
                      <p className="text-sm italic text-text-primary">
                        "I love drawing mockups, but I also enjoy mathematics and solving logical puzzles. I want a path that merges both."
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {previewStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard elevation={2} className="p-8 border border-solid rounded-[24px] relative overflow-hidden">
                  {/* Glowing breathing highlight */}
                  <motion.div
                    className="absolute -inset-1 rounded-[24px] border border-[#70E1FF]/30 pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-ai-cyan" />
                    <h3 className="text-lg font-bold text-text-primary">Step 2: Career Mentor AI Analysis</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-ai-cyan uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-ai-cyan animate-ping" />
                    AI Analyzing suitability constraints...
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-[18px] p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <span className="font-plus-jakarta font-bold text-brand text-xs tracking-tight">AI</span>
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed">
                        "Based on your Class 12 PCM stream, the Academic Suitability score is highly aligned. Your passion for visual design matches interest vectors in digital production and human-centered technology. I am scoring 150+ paths..."
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {previewStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard elevation={2} className="p-8 border border-solid rounded-[24px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-recommendation-purple/10 blur-[80px] rounded-full pointer-events-none" />
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-6 h-6 text-recommendation-purple" />
                    <h3 className="text-lg font-bold text-text-primary">Step 3: Recommendation Results</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                    <div>
                      <span className="text-xs text-text-secondary uppercase font-semibold">Top Recommendation Match</span>
                      <h4 className="text-2xl font-bold text-text-primary mt-1">UX DESIGNER</h4>
                    </div>
                    <div className="text-2xl font-plus-jakarta font-bold tracking-tight text-brand">94% MATCH</div>
                  </div>
                  <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-brand rounded-full" style={{ width: '94%' }} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand font-medium">PCM Stream Aligned</span>
                    <span className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand font-medium">Design Interests</span>
                    <span className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand font-medium">Logical Aptitude</span>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {previewStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard elevation={2} className="p-8 border border-solid rounded-[24px]">
                  <div className="flex items-center gap-3 mb-6">
                    <Map className="w-6 h-6 text-brand" />
                    <h3 className="text-lg font-bold text-text-primary">Step 4: Custom Career Roadmap</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 font-bold text-brand text-xs">01</div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Acquire Core Design Foundations</h4>
                        <p className="text-xs text-text-secondary mt-1">Focus on wireframing, typography, and tool learning (Figma).</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 font-bold text-brand text-xs">02</div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Build Portfolio Case Studies</h4>
                        <p className="text-xs text-text-secondary mt-1">Design three mock app concepts explaining research and visual iteration.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 font-bold text-brand text-xs">03</div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Target Key Entrance Exams</h4>
                        <p className="text-xs text-text-secondary mt-1">Prepare for UCEED, NID DAT, or JEE B.Des tracks in IITs/IISc.</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CAREER UNIVERSE ── */}
      <section id="careers" className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <h2 className="font-plus-jakarta font-bold text-[clamp(2rem,5vw,3.5rem)] text-text-primary tracking-tight mb-4">
            CAREER CATALOG
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            150+ career paths mapped with salary ranges, demands, and custom paths.
          </p>
        </SectionReveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {careers.map((career, index) => (
            <div key={index} className={index % 2 === 1 ? 'lg:mt-6' : ''}>
              <CareerCardInline {...career} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── WHY SCPR (Asymmetric Feature Grid) ── */}
      <section className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <SectionReveal className="text-center mb-16">
          <h2 className="font-plus-jakarta font-bold text-[clamp(2rem,5vw,3.5rem)] text-text-primary tracking-tight">
            DESIGNED FOR SUCCESS
          </h2>
        </SectionReveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f, idx) => {
            const isLarge = idx === 0 || idx === 3;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                className={isLarge ? 'md:col-span-2' : 'md:col-span-1'}
              >
                <GlassCard
                  elevation={2}
                  className="h-full p-8 flex flex-col items-start group hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-6">
                    <f.icon size={22} className="text-brand group-hover:scale-105 transition-transform duration-180" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-lg mb-3">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── STUDENT STORIES ── */}
      <section className="py-24 relative z-10 overflow-hidden border-t border-white/[0.06]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-plus-jakarta font-bold text-[clamp(2rem,5vw,3.5rem)] text-text-primary tracking-tight mb-4">
              STUDENT STORIES
            </h2>
            <p className="text-text-secondary text-base sm:text-lg">
              Empowering students across high schools and junior colleges.
            </p>
          </SectionReveal>
        </div>
        <div className="relative w-full max-w-[100vw] overflow-hidden group">
          <div className="flex md:w-max overflow-x-auto snap-x snap-mandatory hide-scrollbar md:animate-scroll md:hover:[animation-play-state:paused] gap-6 px-4 md:px-0">
            <div className="flex gap-6 shrink-0 pr-6 md:pr-0">
              {stories.map((s, idx) => (
                <StoryCard key={`a-${idx}`} {...s} />
              ))}
            </div>
            <div className="hidden md:flex gap-6 shrink-0">
              {stories.map((s, idx) => (
                <StoryCard key={`b-${idx}`} {...s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <SectionReveal className="text-center mb-16">
          <h2 className="font-plus-jakarta font-bold text-[clamp(2rem,5vw,3.5rem)] text-text-primary tracking-tight mb-6">
            ABOUT SCPR
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            SCPR is an AI-powered student counseling platform helping Class 10 & 12 students discover their optimal paths based on streams and academic goals.
          </p>
        </SectionReveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {aboutCards.map((card, idx) => (
            <motion.div key={idx} variants={scaleIn} className="w-full h-full">
              <GlassCard
                elevation={2}
                className="h-full p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:bg-brand/10 group-hover:border-brand/20 transition-colors duration-300">
                  <card.icon className="text-brand w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-4">{card.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center py-24 overflow-hidden border-t border-white/[0.06]">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <h2 className="font-plus-jakarta font-bold text-[clamp(2.5rem,8vw,5rem)] uppercase text-text-primary leading-[1.1] tracking-tight mb-6">
            BEGIN YOUR PATH FINDING
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mb-10 max-w-xl mx-auto">
            Take the assessment in under 10 minutes and receive immediate score matches.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" onClick={() => navigate('/register')} className="px-10 py-4 text-lg">
              Get Started Free <ArrowRight className="h-5 w-5 ml-2 animate-pulse" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative bg-[#0A0A0F] pt-16 pb-6 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 md:gap-8 mb-12">
            <div className="flex flex-col gap-5">
              <div className="font-anton text-[1.6rem] text-brand tracking-wider">SCPR</div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                AI-powered career guidance for Indian students — no payment required.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-fit inline-flex items-center gap-2 bg-brand text-text-primary font-semibold text-sm px-5 py-2.5 rounded-[18px] hover:bg-brand-hover hover:scale-[1.02] transition-all duration-180 focus-ring mt-1 cursor-pointer"
              >
                Begin Your Journey <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4 uppercase tracking-[0.15em] text-xs">Product</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-brand transition-colors duration-180 focus-ring rounded"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4 uppercase tracking-[0.15em] text-xs">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-sm text-text-secondary hover:text-brand transition-colors duration-180 focus-ring rounded text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-sm text-text-secondary hover:text-brand transition-colors duration-180 focus-ring rounded text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4 uppercase tracking-[0.15em] text-xs">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:scpr@example.com"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.08] text-text-secondary text-sm hover:border-brand/40 hover:text-brand transition-all duration-180 focus-ring w-fit"
                  >
                    <Mail size={14} /> scpr@example.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.08] text-text-secondary text-sm hover:border-brand/40 hover:text-brand transition-all duration-180 focus-ring w-fit"
                  >
                    <GithubIcon /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.08] text-text-secondary text-sm hover:border-brand/40 hover:text-brand transition-all duration-180 focus-ring w-fit"
                  >
                    <LinkedinIcon /> LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-xs text-center sm:text-left">
              &copy; 2026 SCPR. Built for Indian students.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-text-secondary hover:border-brand/40 hover:text-brand transition-all duration-180 focus-ring"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-text-secondary hover:border-brand/40 hover:text-brand transition-all duration-180 focus-ring"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Supporting sub-components (inlined in the same file) ── */

function CareerCardInline({
  title,
  salary,
  demand,
  growth,
  color,
}: {
  title: string;
  salary: string;
  demand: string;
  growth: string;
  color: string;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const animParams = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) % 1000;
    const frac = hash / 1000;
    return { duration: 5 + frac * 3, delay: (hash % 200) / 100 };
  }, [title]);

  return (
    <motion.div
      variants={scaleIn}
      className="w-full h-full"
      animate={prefersReducedMotion ? {} : { translateY: [0, -12, 0], rotateZ: [0, 0.5, -0.5, 0] }}
      transition={{
        translateY: {
          duration: animParams.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: animParams.delay,
        },
        rotateZ: {
          duration: animParams.duration * 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: animParams.delay,
        },
      }}
    >
      <GlassCard
        elevation={2}
        className="h-full p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer sm:cursor-default"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="font-plus-jakarta font-bold text-[1.3rem] tracking-tight mb-4" style={{ color }}>
              {title}
            </h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Avg. Salary', value: salary, accent: false },
                { label: 'Demand', value: demand, accent: false },
                { label: 'Growth', value: growth, accent: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center border-b border-white/5 pb-2 last:border-b-0"
                >
                  <span className="text-text-secondary text-xs sm:text-sm">{row.label}</span>
                  <span
                    className={`font-semibold text-xs sm:text-sm ${
                      row.accent ? 'text-brand' : 'text-text-primary'
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div
              className={`sm:hidden overflow-hidden transition-all duration-300 ${
                expanded ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-xs text-text-secondary">
                Discover the skills, roadmap, and top colleges for this career path.
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/register');
            }}
            className="font-semibold text-brand text-sm flex items-center hover:brightness-125 transition-all mt-auto w-fit focus-ring rounded cursor-pointer"
          >
            Explore <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function StoryCard({
  avatar,
  name,
  location,
  stream,
  recommendation,
  quote,
}: {
  avatar: string;
  name: string;
  location: string;
  stream: string;
  recommendation: string;
  quote: string;
}) {
  return (
    <div className="w-[85vw] sm:w-[400px] shrink-0 snap-start">
      <GlassCard elevation={2} className="h-full flex flex-col p-8 rounded-[24px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center text-[1.8rem] shrink-0">
            {avatar}
          </div>
          <div>
            <h4 className="font-semibold text-text-primary text-lg leading-tight">{name}</h4>
            <p className="text-text-secondary text-sm">{location}</p>
          </div>
          <div className="ml-auto">
            <span className="px-3.5 py-1 bg-brand/10 border border-brand/20 text-brand text-[0.7rem] rounded-full uppercase tracking-wider font-semibold">
              {stream}
            </span>
          </div>
        </div>
        <blockquote className="flex-1 mb-8">
          <p className="text-text-secondary text-base italic leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
        <div className="pt-4 border-t border-white/10 mt-auto">
          <p className="text-sm text-text-secondary">
            Recommended: <span className="text-brand font-semibold ml-1">{recommendation}</span>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
