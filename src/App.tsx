import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Factory, 
  MapPin, 
  Zap, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Save, 
  Cpu, 
  Settings,
  Search,
  Activity,
  Box,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Bot,
  Terminal,
  ShieldCheck,
  User,
  RefreshCcw,
  LayoutDashboard,
  Square,
  BarChart3,
  PieChart as PieChartIcon,
  Play,
  Power,
  TrendingUp,
  Table as TableIcon,
  Users,
  MessageSquare,
  Phone,
  Menu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Fab, Robot } from './types.ts';
import { INITIAL_FABS, INITIAL_ROBOTS } from './constants.ts';
import { cn } from './lib/utils.ts';
import { RobotArm3D } from './components/RobotArm3D.tsx';

// --- Components ---

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => (
  <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
      {/* Mobile toggle button */}
      <button 
        onClick={onToggleSidebar}
        className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-50 transition-colors focus:outline-none"
        title="Toggle Menu"
      >
        <Menu size={20} />
      </button>

      <div className="w-8 h-8 bg-brand-primary rounded-md flex items-center justify-center shadow-sm shrink-0">
        <Box className="w-5 h-5 text-white" />
      </div>
      <h1 className="text-sm xs:text-base sm:text-lg font-bold text-slate-800 tracking-tight truncate">
        FABULOUS <span className="text-brand-primary font-medium">FAB OBSERVER</span>
      </h1>
    </div>
    <div className="flex gap-2 sm:gap-4 items-center shrink-0">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-slate-50"
      >
        <LayoutDashboard size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="hidden md:inline uppercase tracking-widest">Dashboard</span>
      </Link>
      <span className="hidden sm:inline text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Bay Area Operations</span>
      <Link 
        to="/new" 
        className="btn-primary text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
      >
        <Plus size={16} />
        <span className="hidden xs:inline">Add Facility</span>
      </Link>
    </div>
  </header>
);

const Sidebar = ({ 
  fabs, 
  onDelete, 
  onReset,
  onClose
}: { 
  fabs: Fab[]; 
  onDelete: (id: string) => void;
  onReset: () => void;
  onClose?: () => void;
}) => {
  const { id: activeId } = useParams();
  const [search, setSearch] = useState('');

  const filteredFabs = useMemo(() => 
    fabs.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.address.toLowerCase().includes(search.toLowerCase())),
    [fabs, search]
  );

  return (
    <aside className="w-80 md:w-96 border-r border-brand-border bg-white flex flex-col shrink-0 overflow-hidden h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3">
        {onClose && (
          <div className="flex items-center justify-between lg:hidden border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] font-mono">Registry Index</span>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
              title="Close Panel"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search facilities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          <button
            onClick={onReset}
            title="Reset to Initial Data"
            className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-colors"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <AnimatePresence initial={false}>
          {filteredFabs.map((fab) => (
            <Link 
              key={fab.id}
              to={`/fab/${fab.id}`}
              onClick={onClose}
              className={cn(
                "group block p-4 rounded-xl border transition-all duration-200 relative",
                activeId === fab.id 
                  ? "bg-slate-50 border-brand-primary/20 shadow-sm" 
                  : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className="flex justify-between items-start">
                <h3 className={cn("font-bold text-sm", activeId === fab.id ? "text-slate-900" : "text-slate-700")}>
                  {fab.name}
                </h3>
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full uppercase font-bold",
                  fab.status === 'active' ? "bg-emerald-500 text-white" : 
                  fab.status === 'maintenance' ? "bg-amber-500 text-white" : 
                  "bg-slate-400 text-white"
                )}>
                  {fab.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[200px]">{fab.address}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className={cn(
                  "flex items-center gap-2 text-[9px] font-mono",
                  activeId === fab.id ? "text-brand-primary" : "text-slate-500"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", fab.status === 'active' ? "bg-emerald-400" : "bg-slate-300")} />
                  {fab.capacity}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(fab.id);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Link>
          ))}
        </AnimatePresence>
        
        {filteredFabs.length === 0 && (
          <div className="py-8 text-center px-4">
            <p className="text-xs text-slate-400 font-mono italic">No facilities match query</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex justify-between bg-white shrink-0">
        <span className="uppercase tracking-wider">{fabs.length} NODES IDENTIFIED</span>
        <span className="uppercase tracking-wider">SYNC: OK</span>
      </div>
    </aside>
  );
};

const FabViewPlaceholder = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center bg-slate-50/50">
    <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
      <Cpu size={32} className="text-slate-300" />
    </div>
    <h2 className="text-xl font-bold text-slate-800">Operational Dashboard</h2>
    <p className="max-w-xs mt-2 text-sm text-slate-500">Select a facility from the network registry to view specialized metrics and configuration options.</p>
  </div>
);

const RobotList = ({ robots, onAddRobot, onDeleteRobot }: { robots: Robot[], onAddRobot: (fabId: string) => void, onDeleteRobot: (id: string) => void }) => {
  const { id } = useParams();
  const fabRobots = robots.filter(r => r.fabId === id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 sm:p-6 lg:p-10 flex-1 overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto">
        <Link to={`/fab/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-primary mb-6 sm:mb-8 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest">Return to Hub</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-4">
              <Bot size={24} className="text-brand-primary shrink-0 sm:w-8 sm:h-8" />
              Robot Fleet Observability
            </h2>
            <p className="text-slate-500 mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">
              Managing <span className="text-brand-primary font-bold">{fabRobots.length}</span> Active Automation Units
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
            <div className="hidden lg:flex gap-4">
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-center shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Healthy Units</p>
                <p className="text-xl font-bold text-emerald-600">{fabRobots.filter(r => r.status === 'operational').length}</p>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-center shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Critical Alert</p>
                <p className="text-xl font-bold text-red-600">{fabRobots.filter(r => r.status === 'error').length}</p>
              </div>
            </div>
            <button 
              onClick={() => id && onAddRobot(id)}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-brand-primary text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-xl hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <Plus size={16} />
              Add Unit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {fabRobots.map((robot) => (
            <div key={robot.id} className="relative group">
              <Link 
                to={`/fab/${id}/robots/${robot.id}`}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -5, borderColor: 'var(--color-brand-primary)' }}
                  className="card-nexus p-6 relative overflow-hidden h-full border-transparent"
                >
                  <div className="flex items-center justify-between mb-4 pr-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-primary transition-colors">
                        <Terminal size={20} />
                      </div>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1",
                        robot.status === 'operational' ? "bg-emerald-500 text-white" : 
                        robot.status === 'error' ? "bg-red-500 text-white" : 
                        "bg-slate-400 text-white"
                      )}>
                        {robot.status === 'operational' && <ShieldCheck size={10} />}
                        {robot.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 mb-1">{robot.model}</h3>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">S/N: {robot.serialNumber}</p>

                  <div className="space-y-2 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> Last Service
                      </span>
                      <span className="text-slate-700 font-medium">{robot.lastService}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Zap size={12} /> Payload
                      </span>
                      <span className="text-slate-700 font-medium">{robot.loadCapacity}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-50 relative z-10">
                    <div className="text-center bg-slate-50/50 py-2 rounded">
                      <p className="text-[7px] text-slate-400 uppercase font-bold tracking-tighter mb-0.5">Current</p>
                      <p className={cn("text-[10px] font-mono font-bold", robot.status === 'offline' ? "text-slate-300" : "text-slate-700")}>
                        {robot.status === 'offline' ? '0.0' : '12.8'}A
                      </p>
                    </div>
                    <div className="text-center bg-slate-50/50 py-2 rounded">
                      <p className="text-[7px] text-slate-400 uppercase font-bold tracking-tighter mb-0.5">Vibration</p>
                      <p className={cn("text-[10px] font-mono font-bold", robot.status === 'offline' ? "text-slate-300" : "text-slate-700")}>
                        {robot.status === 'offline' ? '0.000' : '0.042'}G
                      </p>
                    </div>
                    <div className="text-center bg-slate-50/50 py-2 rounded">
                      <p className="text-[7px] text-slate-400 uppercase font-bold tracking-tighter mb-0.5">Temp</p>
                      <p className={cn("text-[10px] font-mono font-bold", robot.status === 'offline' ? "text-slate-300" : "text-slate-700")}>
                        {robot.status === 'offline' ? '0.0' : '35.2'}°C
                      </p>
                    </div>
                  </div>
                  
                  {robot.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                  )}
                </motion.div>
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteRobot(robot.id);
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-50 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        
        {fabRobots.length === 0 && (
          <div className="py-20 text-center card-nexus border-dashed bg-slate-50/50">
            <Bot size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-mono text-sm">NO AUTOMATION HARDWARE ASSIGNED TO THIS NODE</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const RobotArmVisual = ({ status, activeSims = new Set() }: { status: string, activeSims?: Set<'current' | 'vibration' | 'temperature'> }) => {
  const fanucOrange = "#ed8b00";
  const darkSlate = "#0f172a";
  const labelColor = "#94a3b8";
  const accentColor = "#38bdf8";

  return (
    <div className="w-full h-96 bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group select-none">
      {/* High-Tech Grid Background */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ 
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Schematic Markings */}
      <div className="absolute bottom-6 left-6 flex flex-col font-mono text-[8px] text-slate-500 uppercase tracking-widest gap-1 border-l border-brand-primary/30 pl-3 z-10">
        <span className="text-brand-primary/60">SERVO_LOOP: 2.5kHz</span>
        <span>REACH: 1.85m</span>
        <span>AXES: 6_DOF</span>
        <span>PAYLOAD: 210kg</span>
      </div>

      <div className="relative w-full h-full flex items-center justify-center pt-10">
        <svg viewBox="0 0 500 500" className="w-[85%] h-full max-w-[500px]">
          <defs>
            <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fanucOrange} />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={accentColor} />
            </marker>

            <filter id="axisGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="250" cy="450" rx="120" ry="20" fill="rgba(0,0,0,0.4)" />

          {/* J1 Base Assembly */}
          <g transform="translate(250, 420)">
            {/* Axis 1 Base */}
            <circle cx="0" cy="0" r="60" fill="#1e293b" />
            <path d="M-55 5 Q0 15 55 5 L50 -20 Q0 -10 -50 -20 Z" fill="#334155" />
            
            {/* Axis 1 Rotation Indicator */}
            <path d="M-80 15 A 80 20 0 1 0 80 15" fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrow)" />
            <text x="70" y="45" className="fill-brand-primary font-mono text-[9px] font-bold uppercase" filter="url(#axisGlow)">AXIS 1</text>

            {/* J1 Body / Pillar */}
            <g transform="translate(0, -10)">
              <rect x="-35" y="-60" width="70" height="60" fill="url(#armGradient)" rx="4" />
              <rect x="-20" y="-50" width="40" height="15" fill={darkSlate} opacity="0.3" rx="2" />
              
              {/* J2 Shoulder Joint */}
              <g transform="translate(0, -60)">
                <circle cx="0" cy="0" r="28" fill={darkSlate} />
                <circle cx="0" cy="0" r="22" fill="#334155" stroke={fanucOrange} strokeWidth="1" />
                
                {/* Axis 2 Indicator */}
                <path d="M35 -15 A 40 40 0 0 1 35 15" fill="none" stroke={activeSims.has('temperature') ? '#ef4444' : accentColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="50" y="5" className={cn("font-mono text-[9px] font-bold uppercase", activeSims.has('temperature') ? "fill-red-500" : "fill-brand-primary")} filter="url(#axisGlow)">AXIS 2</text>

                {/* Lower Arm Link */}
                <g transform="rotate(-20)">
                  <path d="M-15 0 L15 0 L10 -130 L-10 -130 Z" fill="url(#armGradient)" />
                  <rect x="-4" y="-110" width="8" height="80" fill="rgba(0,0,0,0.2)" rx="2" />
                  
                  {/* J3 Elbow Joint */}
                  <g transform="translate(0, -130) rotate(50)">
                    <circle cx="0" cy="0" r="20" fill={darkSlate} />
                    <circle cx="0" cy="0" r="15" fill="#334155" stroke={fanucOrange} strokeWidth="1" />

                    {/* Axis 3 Indicator */}
                    <path d="M-25 -10 A 25 25 0 0 0 -25 10" fill="none" stroke={activeSims.has('current') ? '#ef4444' : accentColor} strokeWidth="1.5" markerStart="url(#arrow)" />
                    <text x="-65" y="5" className={cn("font-mono text-[9px] font-bold uppercase", activeSims.has('current') ? "fill-red-500" : "fill-brand-primary")} filter="url(#axisGlow)">AXIS 3</text>

                    {/* Upper Arm Link */}
                    <g>
                      <path d="M-10 0 L10 0 L15 -100 L-15 -100 Z" fill="url(#armGradient)" />
                      
                      {/* Axis 4 Rotation (Forearm Axial) */}
                      <g transform="translate(0, -60)">
                         <path d="M-18 -5 L18 -5" stroke={activeSims.has('vibration') ? '#ef4444' : accentColor} strokeWidth="1" strokeDasharray="3 2" />
                         <path d="M12 -15 A 15 15 0 1 1 12 5" fill="none" stroke={activeSims.has('vibration') ? '#ef4444' : accentColor} strokeWidth="1" markerEnd="url(#arrow)" />
                         <text x="30" y="-10" className={cn("font-mono text-[9px] font-bold uppercase", activeSims.has('vibration') ? "fill-red-500" : "fill-brand-primary")} filter="url(#axisGlow)">AXIS 4</text>
                      </g>

                      {/* J5 Wrist Tilt */}
                      <g transform="translate(0, -100) rotate(-40)">
                         <rect x="-18" y="-40" width="36" height="40" fill={darkSlate} rx="4" />
                         <circle cx="0" cy="-20" r="14" fill="#334155" stroke={fanucOrange} strokeWidth="1" />
                         
                         {/* Axis 5 Indicator */}
                         <path d="M22 -35 A 20 20 0 0 1 22 -5" fill="none" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
                         <text x="35" y="-20" className="fill-brand-primary font-mono text-[9px] font-bold uppercase" filter="url(#axisGlow)">AXIS 5</text>

                         {/* Axis 6 Tool Flange */}
                         <g transform="translate(0, -40)">
                            <rect x="-10" y="-15" width="20" height="15" fill={fanucOrange} rx="2" />
                            <circle cx="0" cy="-15" r="10" fill={darkSlate} stroke={fanucOrange} strokeWidth="1" />
                            
                            {/* Axis 6 Rotation Indicator */}
                            <path d="M-15 -30 A 15 15 0 1 0 15 -30" fill="none" stroke={accentColor} strokeWidth="1" markerEnd="url(#arrow)" />
                            <text x="25" y="-35" className="fill-brand-primary font-mono text-[9px] font-bold uppercase" filter="url(#axisGlow)">AXIS 6</text>

                            {/* End Effector */}
                            <path d="M-4 -15 L-6 -30 M4 -15 L6 -30" stroke={labelColor} strokeWidth="2" strokeLinecap="round" />
                         </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>

          {/* SIMULATION ERROR CALLOUTS */}
          {activeSims.has('current') && (
            <g transform="translate(250, 250)" className="animate-bounce">
               <rect x="-50" y="-30" width="100" height="25" rx="4" fill="#ef4444" />
               <text y="-13" textAnchor="middle" fill="white" className="font-mono text-[9px] font-bold">AXIS_3: OVERLOAD</text>
               <path d="M0 -5 L-5 -10 L5 -10" fill="#ef4444" transform="rotate(180 0 -5)" />
            </g>
          )}

          {activeSims.has('vibration') && (
            <g transform="translate(250, 320)" className="animate-pulse">
               <rect x="-50" y="-30" width="100" height="25" rx="4" fill="#ef4444" />
               <text y="-13" textAnchor="middle" fill="white" className="font-mono text-[9px] font-bold">AXIS_4: VIB_FAULT</text>
               <path d="M0 -5 L-5 -10 L5 -10" fill="#ef4444" transform="rotate(180 0 -5)" />
            </g>
          )}

          {activeSims.has('temperature') && (
            <g transform="translate(250, 360)" className="animate-pulse">
               <rect x="-50" y="-30" width="100" height="25" rx="4" fill="#ef4444" />
               <text y="-13" textAnchor="middle" fill="white" className="font-mono text-[9px] font-bold">CORE: THERMAL</text>
               <path d="M0 -5 L-5 -10 L5 -10" fill="#ef4444" transform="rotate(180 0 -5)" />
            </g>
          )}

          {/* Status Overlay UI */}
          <g transform="translate(40, 40)">
            <rect width="180" height="40" rx="6" fill="rgba(15,23,42,0.8)" stroke={status === 'error' || activeSims.size > 0 ? '#ef4444' : '#10b981'} strokeWidth="1" />
            <circle cx="20" cy="20" r="5" fill={status === 'error' || activeSims.size > 0 ? '#ef4444' : '#10b981'} className="animate-pulse" />
            <text x="35" y="18" fill="white" className="font-mono text-[10px] font-bold uppercase">System: {status === 'error' || activeSims.size > 0 ? 'FAULT' : 'OPERATIONAL'}</text>
            <text x="35" y="30" fill={labelColor} className="font-mono text-[8px] uppercase tracking-tighter">DOF_LOCK: {status === 'offline' ? 'ENGAGED' : 'ACTIVE'}</text>
          </g>
        </svg>
      </div>

      {/* Technical HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-6 font-mono text-[10px] text-brand-primary font-bold flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 border border-brand-primary/30 rounded-md">
          <RefreshCcw size={12} />
          TECH_SCHEMATIC: R-2000iC_SERIES
        </div>

        <div className="absolute top-6 right-6 font-mono text-[9px] text-slate-400 bg-slate-900/50 backdrop-blur px-3 py-1.5 border border-slate-800 rounded-md">
          SIM_MODE: {status === 'error' || activeSims.size > 0 ? 'FAULT_TRACE' : 'RT_STREAM'}
        </div>

        {activeSims.size > 0 && (
          <div className="absolute inset-x-0 bottom-0 py-2 border-t border-red-500/50 flex items-center justify-center gap-3 text-red-500 font-bold text-xs tracking-tighter bg-red-500/10 z-20 animate-pulse">
            <AlertTriangle size={14} />
            SIMULATED_FAULT_INJECTED: {Array.from(activeSims).join(' | ').toUpperCase()}
          </div>
        )}

        <div className="absolute bottom-6 right-6 font-mono text-[8px] text-slate-500 bg-slate-900/50 backdrop-blur px-3 py-4 border border-slate-800 rounded-md leading-relaxed z-10">
          <span className="text-brand-primary font-bold block mb-1 underline uppercase">Nominal_Axis_Pose:</span>
          J1_BASE: 0.00° (CENTER)<br />
          J2_SHDR: -20.00° (OFFSET)<br />
          J3_ELBW: 30.00° (DEFLECTION)<br />
          J4_FORE: 0.00° (AXIAL)<br />
          J5_WRST: -40.00° (PITCH)<br />
          J6_FLNG: 0.00° (ROLL)
        </div>

        {status === 'error' && (
          <div className="absolute inset-x-0 bottom-0 py-2 border-t border-red-500/50 flex items-center justify-center gap-3 text-red-500 font-bold text-xs tracking-tighter bg-red-500/10 z-20">
            <AlertCircle size={14} />
            CRITICAL_FAULT: KINEMATIC_ENVELOPE_BREACHED
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
        <div className="w-12 h-12 border-t-2 border-r-2 border-slate-600 rounded-tr-xl" />
      </div>
      <div className="absolute bottom-0 left-0 p-2 opacity-20 pointer-events-none">
        <div className="w-12 h-12 border-b-2 border-l-2 border-slate-600 rounded-bl-xl" />
      </div>
    </div>
  );
};


const RobotDetail = ({ robots, onUpdateRobot, onDeleteRobot }: { robots: Robot[], onUpdateRobot: (robot: Robot) => void, onDeleteRobot: (id: string) => void }) => {
  const { id, robotId } = useParams();
  const robot = robots.find(r => r.id === robotId);
  const isOffline = robot?.status === 'offline';
  const isError = robot?.status === 'error';
  const navigate = useNavigate();
  
  const [telemetry, setTelemetry] = useState({
    current: isOffline ? 0 : 12.5,
    vibration: isOffline ? 0 : 0.02,
    temperature: isOffline ? 0 : 34.2
  });
  
  const [history, setHistory] = useState<{
    timestamp: string;
    current: number;
    vibration: number;
    temperature: number;
    status: 'normal' | 'warning' | 'critical';
  }[]>([]);

  const [activeSims, setActiveSims] = useState<Set<'current' | 'vibration' | 'temperature'>>(new Set());
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [lastAgentAction, setLastAgentAction] = useState<string | null>(null);
  const [assignedMaintainer, setAssignedMaintainer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');
  const [visualMode, setVisualMode] = useState<'2d' | '3d' | 'live'>('2d');

  const [simulationIssue, setSimulationIssue] = useState<{ title: string; description: string; solution: string } | null>(null);
  const [showErrorDispatch, setShowErrorDispatch] = useState(false);
  const [showPowerConfirm, setShowPowerConfirm] = useState(false);
  const [showDeferredMessage, setShowDeferredMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Robot>>({});

  useEffect(() => {
    if (robot) {
      setFormData({
        model: robot.model,
        serialNumber: robot.serialNumber,
        loadCapacity: robot.loadCapacity,
        lastService: robot.lastService
      });
    }
  }, [robot]);

  useEffect(() => {
    if (isError) {
      setShowErrorDispatch(true);
    }
  }, [isError, robotId]);

  useEffect(() => {
    if (isOffline) {
      setTelemetry({ current: 0, vibration: 0, temperature: 0 });
      setHistory([]);
    } else {
      setTelemetry({ current: 12.5, vibration: 0.02, temperature: 34.2 });
    }
  }, [isOffline]);

  useEffect(() => {
    if (isOffline) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = now.getSeconds();
      const isCriticalCycle = seconds % 30 === 0;

      let newCurrent = Number((12 + Math.random() * 2).toFixed(1));
      let newVibration = Number((0.01 + Math.random() * 0.05).toFixed(3));
      let newTemp = Number((34 + Math.random() * 1).toFixed(1));

      if (activeSims.has('current')) {
        newCurrent = Number((18 + Math.random() * 2).toFixed(1));
      }
      if (activeSims.has('vibration')) {
        newVibration = Number((0.08 + Math.random() * 0.02).toFixed(3));
      }
      if (activeSims.has('temperature')) {
        newTemp = Number((75 + Math.random() * 5).toFixed(1));
      }
      
      const isSimulatedCritical = activeSims.size > 0;
      
      const newEntry = {
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        current: newCurrent,
        vibration: newVibration,
        temperature: newTemp,
        isSystemCritical: isCriticalCycle,
        simulatedMetrics: Array.from(activeSims),
        status: (isCriticalCycle || isSimulatedCritical) ? 'critical' : (newCurrent > 13.5 || newVibration > 0.05) ? 'warning' : 'normal' as 'normal' | 'warning' | 'critical'
      };

      setTelemetry({
        current: newCurrent,
        vibration: newVibration,
        temperature: newTemp
      });
      
      setHistory(prev => {
        const updated = [...prev, newEntry];
        return updated.slice(-30); // Keep last 30 seconds
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOffline, activeSims]);

  const handleTogglePower = () => {
    if (!robot) return;
    
    // Optimistically show the deferred message first
    setShowDeferredMessage(true);
    setShowPowerConfirm(false);

    // Update status after a slight simulated delay
    setTimeout(() => {
      onUpdateRobot({
        ...robot,
        status: isOffline ? 'operational' : 'offline'
      });
      setShowDeferredMessage(false);
    }, 4000);
  };

  const handleContactMaintenance = (name: string, phone: string, isAuto: boolean = false) => {
    console.log(`Messaging maintenance: ${name}`);
    
    // Set assignment status
    setAssignedMaintainer(name);
    
    if (isAuto) {
      setLastAgentAction(`Agent AI Dispatched ${name} to resolve detected faults.`);
      setTimeout(() => setLastAgentAction(null), 8000);
    }
    
    const issues = {
      current: {
        title: "⚡ CURRENT OVERLOAD",
        description: "Servo motor on Axis 3 is drawing 18.2A.",
        solution: "Inspect Axis 3 gearbox and check for mechanical binding."
      },
      vibration: {
        title: "🫨 HARMONIC INSTABILITY",
        description: "J4 wrist vibration has reached 0.085 G-RMS.",
        solution: "Recalibrate PID loops for Axis 4/5 and check tool flange bolts."
      },
      temperature: {
        title: "🔥 THERMAL EXCEEDANCE",
        description: "Internal core temperature at 76.4°C.",
        solution: "Check control cabinet filters and verify heatsink fins are clean."
      }
    };

    if (activeSims.size > 0) {
      let faultSummary = "";
      activeSims.forEach(type => {
        const issue = issues[type as keyof typeof issues];
        if (issue) {
          faultSummary += `\n\n🚨 ${issue.title}\nIssue: ${issue.description}\nRecommended Fix: ${issue.solution}`;
        }
      });

      alert(`PREDICTIVE MAINTENANCE ALERT: ${isAuto ? 'Autonomous AI' : 'Manual operator'} is dispatching ${name} (${phone})\n\nTHE NEXUS SYSTEM HAS DETECTED ACTIVE FAULTS:${faultSummary}\n\nSupport tech ${name} has been notified and is in-route to resolve these issues.`);
    } else {
      alert(`SYSTEM STATUS PING: ${name} (${phone}) has been contacted. The Nexus Predictive engine is currently reporting all systems operational, but ${name} will monitor the live telemetry feed for any emerging patterns.`);
    }
  };

  const handleSaveEdit = () => {
    if (robot && formData) {
      onUpdateRobot({
        ...robot,
        ...formData
      } as Robot);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (robot && id) {
      onDeleteRobot(robot.id);
      navigate(`/fab/${id}/robots`);
    }
  };

  const handleSimulate = (type: 'current' | 'vibration' | 'temperature') => {
    const issues = {
      current: {
        title: "⚡ CURRENT OVERLOAD",
        description: "Servo motor on Axis 3 is drawing 18.2A (Nominal: 12.5A). This suggests excessive load or friction in the J3 joint.",
        solution: "Verify payload specifications and inspect Axis 3 gearbox for lubrication depletion or mechanical binding."
      },
      vibration: {
        title: "🫨 HARMONIC INSTABILITY",
        description: "Vibration delta at J4 wrist has reached 0.085 G-RMS. High-frequency oscillations detected during high-speed transit.",
        solution: "Perform recalibration of PID loops for Axis 4 and 5. If vibration persists, inspect the tool flange mounting bolts for fatigue."
      },
      temperature: {
        title: "🔥 THERMAL EXCEEDANCE",
        description: "Internal core temperature at 76.4°C. System has entered thermal-protection mode (reduced velocity).",
        solution: "Check control cabinet ventilation filters and ensure ambient room temperature is below 25°C. Clean the internal heatsink fins."
      }
    };

    if (activeSims.has(type)) {
      const newSims = new Set(activeSims);
      newSims.delete(type);
      setActiveSims(newSims);
      setSimulationIssue(issues[type]);
    } else {
      const newSims = new Set(activeSims);
      newSims.add(type);
      setActiveSims(newSims);
      
      // Agent Mode logic: Auto-contact when fault is triggered
      if (isAgentMode) {
        setTimeout(() => {
          handleContactMaintenance('John Doe', '+1 (555) 012-3456', true);
        }, 800);
      }
    }
  };

  if (!robot) return <div>Robot not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-10 flex-1 overflow-y-auto relative"
    >
      {/* Power Confirmation Modal */}
      <AnimatePresence>
        {showPowerConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
                <Power size={18} className={isOffline ? "text-emerald-500" : "text-amber-500"} />
                <h4 className="text-white font-bold text-sm uppercase tracking-tight">System Power Authorization</h4>
              </div>
              <div className="p-8 text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4",
                  isOffline ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                  <Power size={32} />
                </div>
                <h5 className="text-slate-900 font-bold mb-2">
                  Confirm {isOffline ? 'Initialization' : 'Termination'} Sequence?
                </h5>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  {isOffline ? (
                    <>
                      Warning: Unit <span className="font-mono font-bold">{robot.serialNumber}</span> boot sequence requires strict adherence to safety protocols. <span className="text-amber-600 font-bold block mt-2">Clear 6ft radius immediately.</span>
                    </>
                  ) : (
                    <>Are you sure you want to transition Unit <span className="font-mono font-bold">{robot.serialNumber}</span> to <span className="font-bold underline">OFFLINE</span> state?</>
                  )}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowPowerConfirm(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={handleTogglePower}
                    className={cn(
                      "flex-1 py-3 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all",
                      isOffline ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                    )}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deferred Shutdown Message */}
      <AnimatePresence>
        {showDeferredMessage && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-[2px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-slate-900 text-white p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Clock size={24} className="text-brand-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary mb-2">Protocol Queued</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {isOffline ? (
                    <>
                      All safety protocols should be followed when initiating the robot to turn back on. <span className="text-white font-bold block mt-2">Ensure nobody is within 6 feet of the robot, to avoid being hit.</span>
                    </>
                  ) : (
                    <>Sequence initiated. The robot will transition to OFFLINE mode once it completes its <span className="text-white font-bold italic">current processing task</span>.</>
                  )}
                </p>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4 }}
                  className="h-full bg-brand-primary"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Agent Automated Dispatch Alert */}
      <AnimatePresence>
        {showErrorDispatch && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-red-500/20 overflow-hidden"
            >
              <div className="bg-red-600 px-8 py-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0 animate-pulse">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">Automated Incident Dispatch</h4>
                  <p className="text-red-100 text-[10px] font-mono uppercase tracking-widest opacity-80">AI Agent Protocol: 0xDEADBEEF</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Bot size={32} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      The AI Observability Agent has detected a <span className="text-red-600 font-bold">CRITICAL SYSTEM ERROR</span> for Unit <span className="font-mono font-bold text-slate-800">{robot.serialNumber}</span>.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 uppercase">Incident Contacted:</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">John Doe</p>
                          <p className="text-[10px] text-slate-500 uppercase font-medium">Robot Maintenance Manager</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pl-5">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Terminal size={12} className="text-slate-400" />
                          j.doe@fabulous-fab.com
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Activity size={12} className="text-slate-400" />
                          +1 (555) 012-9874
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={() => setShowErrorDispatch(false)}
                    className="group relative w-full py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                    <span>Acknowledge Protocol</span>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </button>
                  <p className="text-center mt-3 text-[9px] text-slate-400 uppercase tracking-widest leading-none">
                    Security logged at: {new Date().toLocaleTimeString()} UTC
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulation Modal Overlay */}
      {simulationIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
              <h4 className="text-white font-mono text-xs font-bold tracking-widest">{simulationIssue.title}</h4>
              <button 
                onClick={() => setSimulationIssue(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnostic Data</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  "{simulationIssue.description}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={12} /> Recommended Recovery
                </p>
                <p className="text-sm text-slate-600 leading-relaxed px-1">
                  {simulationIssue.solution}
                </p>
              </div>
              <button 
                onClick={() => setSimulationIssue(null)}
                className="w-full mt-4 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Acknowledge Alert
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link to={`/fab/${id}/robots`} className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-colors group shrink-0">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest">Return to Fleet</span>
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button 
              onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border transition-all shadow-sm",
                isEditing 
                  ? "bg-brand-primary border-brand-primary text-white hover:bg-brand-primary-hover shadow-brand-primary/20" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary"
              )}
            >
              {isEditing ? <Save size={12} className="sm:w-3.5 sm:h-3.5" /> : <Settings size={12} className="sm:w-3.5 sm:h-3.5" />}
              {isEditing ? 'Commit Configuration' : 'Mod Configuration'}
            </button>

            {!isEditing && (
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 transition-all shadow-sm"
              >
                <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                Decommission
              </button>
            )}

            <button 
              onClick={() => setShowPowerConfirm(true)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border transition-all shadow-sm",
                isOffline 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
                  : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              )}
            >
              <Power size={12} className="sm:w-3.5 sm:h-3.5" />
              {isOffline ? 'Initiate Boot' : 'Emergency Stop'}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="flex-1 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Model Specification</label>
                      <input 
                        value={formData.model}
                        onChange={e => setFormData({ ...formData, model: e.target.value })}
                        className="w-full text-xl sm:text-2xl md:text-4xl font-bold text-slate-900 tracking-tighter bg-slate-50 border-b-2 border-brand-primary px-2 py-1 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Registry Serial Number</label>
                      <input 
                        value={formData.serialNumber}
                        onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                        className="w-full text-brand-primary font-mono text-xs font-bold tracking-widest uppercase bg-slate-50 border-b border-brand-primary px-2 py-1 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tighter break-words">{robot.model}</h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                      <p className="text-brand-primary font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">SERIAL: {robot.serialNumber}</p>
                      <span className={cn(
                        "text-[9px] sm:text-[10px] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase font-bold",
                        robot.status === 'operational' ? "bg-emerald-500 text-white" : 
                        robot.status === 'error' ? "bg-red-500 text-white" : 
                        "bg-slate-400 text-white"
                      )}>
                        System {robot.status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
 
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border border-slate-150 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Live Link: {visualMode.toUpperCase()} Diagnostic Mode</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                  <button 
                    onClick={() => setVisualMode('2d')}
                    className={cn(
                      "px-2 sm:px-3 py-1 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 sm:gap-2",
                      visualMode === '2d' ? "bg-white text-brand-primary shadow-sm animate-fade-in" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Square size={10} className="sm:w-3 sm:h-3" /> <span className="hidden xs:inline">2D Schematic</span><span className="xs:hidden">2D</span>
                  </button>
                  <button 
                    onClick={() => setVisualMode('3d')}
                    className={cn(
                      "px-2 sm:px-3 py-1 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 sm:gap-2",
                      visualMode === '3d' ? "bg-white text-brand-primary shadow-sm animate-fade-in" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Box size={10} className="sm:w-3 sm:h-3" /> <span className="hidden xs:inline">3D Simulator</span><span className="xs:hidden">3D</span>
                  </button>
                  <button 
                    onClick={() => setVisualMode('live')}
                    className={cn(
                      "px-2 sm:px-3 py-1 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 sm:gap-2",
                      visualMode === 'live' ? "bg-white text-brand-primary shadow-sm animate-fade-in" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Play size={10} className="sm:w-3 sm:h-3" /> <span className="hidden xs:inline">Live Feed</span><span className="xs:hidden">Live</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {visualMode === '2d' ? (
                  <motion.div
                    key="2d-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RobotArmVisual status={robot.status} activeSims={activeSims} />
                  </motion.div>
                ) : visualMode === '3d' ? (
                  <motion.div
                    key="3d-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RobotArm3D 
                      status={robot.status} 
                      activeSims={activeSims} 
                      onFaultDetected={(jointName) => {
                        if (robot.status !== 'error') {
                          handleSimulate('vibration');
                          setLastAgentAction(`Haptic link detected anomalies in ${jointName}. Triggering thermal diagnostic.`);
                        }
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="live-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-60 xs:h-80 sm:h-96 md:h-[400px] bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative"
                  >
                    <iframe 
                      src="https://drive.google.com/file/d/1e8BZXgcWYZI34xDTv5s7HLrzk5JffOiC/preview?autoplay=1&mute=1" 
                      className="absolute inset-0 w-full h-full border-0"
                      allow="autoplay; fullscreen"
                      title="Robot Live Feed"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 backdrop-blur px-3 py-1 rounded font-mono text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live Feed: Unit {robot.serialNumber}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="card-nexus p-4 sm:p-6 border-l-4 border-l-brand-primary bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Arm Current</p>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-2xl sm:text-3xl font-mono font-bold", isOffline ? "text-slate-300" : activeSims.has('current') ? "text-red-600" : "text-slate-800")}>{telemetry.current}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold">AMPS</span>
                </div>
                <div className="w-full bg-slate-100 h-1 mt-4 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: isOffline ? 0 : `${(telemetry.current / 20) * 100}%` }}
                    className={cn("h-full", activeSims.has('current') ? "bg-red-600" : "bg-brand-primary")}
                  />
                </div>
              </div>
              <div className="card-nexus p-4 sm:p-6 border-l-4 border-l-amber-500 bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Vibration Delta</p>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-2xl sm:text-3xl font-mono font-bold", isOffline ? "text-slate-300" : activeSims.has('vibration') ? "text-red-600" : "text-slate-800")}>{telemetry.vibration}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold">G-RMS</span>
                </div>
                <div className="w-full bg-slate-100 h-1 mt-4 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: isOffline ? 0 : `${(telemetry.vibration / 0.1) * 100}%` }}
                    className={cn("h-full", activeSims.has('vibration') ? "bg-red-600" : "bg-amber-500")}
                  />
                </div>
              </div>
              <div className="card-nexus p-4 sm:p-6 border-l-4 border-l-orange-500 bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Core Temp</p>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-2xl sm:text-3xl font-mono font-bold", isOffline ? "text-slate-300" : activeSims.has('temperature') ? "text-red-600" : "text-slate-800")}>{telemetry.temperature}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold">°C</span>
                </div>
                <div className="w-full bg-slate-100 h-1 mt-4 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: isOffline ? 0 : `${(telemetry.temperature / 100) * 100}%` }}
                    className={cn("h-full", activeSims.has('temperature') ? "bg-red-600" : "bg-orange-500")}
                  />
                </div>
              </div>
            </div>

            {/* Time Series Log Section */}
            <div className="card-nexus p-4 sm:p-6 lg:p-8 bg-white border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-primary sm:w-[20px] sm:h-[20px]" /> Multi-Sensor telemetry Stream
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Sync: 1.0Hz Resolution | Real-time Analysis</p>
                </div>
                
                <div className="flex p-1 bg-slate-100 rounded-lg w-fit">
                  <button 
                    onClick={() => setViewMode('graph')}
                    className={cn(
                      "px-2.5 sm:px-4 py-1.5 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 sm:gap-2",
                      viewMode === 'graph' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Activity size={12} className="sm:w-[14px] sm:h-[14px]" /> <span className="hidden xs:inline">Visualization</span><span className="xs:hidden">Graph</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={cn(
                      "px-2.5 sm:px-4 py-1.5 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 sm:gap-2",
                      viewMode === 'table' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <TableIcon size={12} className="sm:w-[14px] sm:h-[14px]" /> <span className="hidden xs:inline">Data Chart</span><span className="xs:hidden">Table</span>
                  </button>
                </div>
              </div>

              <div className="h-[380px] sm:h-[500px] lg:h-[640px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {isOffline ? (
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                      <Zap size={32} />
                    </div>
                    <p className="text-slate-400 font-mono text-xs uppercase tracking-widest font-bold">Telemetry Offline</p>
                    <p className="text-[10px] text-slate-300 mt-1 uppercase">Initialize boot sequence to start data stream</p>
                  </div>
                ) : viewMode === 'graph' ? (
                  <div className="space-y-12 py-4">
                   {/* Temperature Graph */}
                   <div className="h-48">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                       Core Temperature History
                       <span className="text-[9px] font-mono lowercase border border-slate-200 px-2 py-0.5 rounded">units: °c</span>
                     </p>
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={history}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="timestamp" hide />
                         <YAxis 
                           domain={['auto', 'auto']} 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fontSize: 10, fill: '#94a3b8' }} 
                         />
                         <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                           itemStyle={{ color: '#fff', fontSize: '12px' }}
                           labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                         />
                         <Line 
                           type="monotone" 
                           dataKey="temperature" 
                           stroke={activeSims.has('temperature') ? "#ef4444" : "#f97316"} 
                           strokeWidth={3} 
                           dot={(props: any) => {
                             const { cx, cy, payload } = props;
                             const isCurrentlySimulated = payload.simulatedMetrics?.includes('temperature') && activeSims.has('temperature');
                             const isGenuineError = payload.temperature > 38 && payload.isSystemCritical;
                             const hasError = isCurrentlySimulated || isGenuineError;
                             
                             return <circle 
                               cx={cx} 
                               cy={cy} 
                               r={hasError ? 4 : 2} 
                               fill={hasError ? "#ef4444" : "#f97316"} 
                               stroke={hasError ? "#fff" : "none"} 
                               strokeWidth={hasError ? 2 : 0} 
                             />;
                           }}
                           activeDot={{ r: 6, strokeWidth: 0 }} 
                         />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>

                   {/* Vibration Graph */}
                   <div className="h-48">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between font-mono">
                       Harmonic Vibration Delta
                       <span className="text-[9px] font-mono lowercase border border-slate-200 px-2 py-0.5 rounded">units: g-rms</span>
                     </p>
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={history}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="timestamp" hide />
                         <YAxis 
                           domain={[0, 0.1]} 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fontSize: 10, fill: '#94a3b8' }} 
                         />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                         />
                         <Line 
                            type="stepAfter" 
                            dataKey="vibration" 
                            stroke={activeSims.has('vibration') ? "#ef4444" : "#f59e0b"} 
                            strokeWidth={2} 
                            dot={(props: any) => {
                              const { cx, cy, payload } = props;
                              const isCurrentlySimulated = payload.simulatedMetrics?.includes('vibration') && activeSims.has('vibration');
                              const isGenuineError = payload.vibration > 0.08 && payload.isSystemCritical;
                              const hasError = isCurrentlySimulated || isGenuineError;

                              return <circle 
                                cx={cx} 
                                cy={cy} 
                                r={hasError ? 4 : 2} 
                                fill={hasError ? "#ef4444" : "#f59e0b"} 
                                stroke={hasError ? "#fff" : "none"} 
                                strokeWidth={hasError ? 2 : 0} 
                              />;
                            }}
                         />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>

                   {/* Current Graph */}
                   <div className="h-48">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                       Servo Current Consumption
                       <span className="text-[9px] font-mono lowercase border border-slate-200 px-2 py-0.5 rounded">units: amps</span>
                     </p>
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={history}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="timestamp" hide />
                         <YAxis 
                            domain={[10, 16]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                         />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                         />
                         <Line 
                            type="monotone" 
                            dataKey="current" 
                            stroke={activeSims.has('current') ? "#ef4444" : "var(--color-brand-primary)"} 
                            strokeWidth={3} 
                            dot={(props: any) => {
                              const { cx, cy, payload } = props;
                              const isCurrentlySimulated = payload.simulatedMetrics?.includes('current') && activeSims.has('current');
                              const isGenuineError = payload.current > 15 && payload.isSystemCritical;
                              const hasError = isCurrentlySimulated || isGenuineError;

                              const normalColor = "var(--color-brand-primary)";
                              return <circle 
                                cx={cx} 
                                cy={cy} 
                                r={hasError ? 4 : 2} 
                                fill={hasError ? "#ef4444" : normalColor} 
                                stroke={hasError ? "#fff" : "none"} 
                                strokeWidth={hasError ? 2 : 0} 
                              />;
                            }}
                         />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse relative">
                      <thead className="sticky top-0 z-10 bg-white">
                        <tr className="border-b border-slate-100 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                          <th className="py-4 px-2 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Timestamp</th>
                          <th className="py-4 px-2 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Current (A)</th>
                          <th className="py-4 px-2 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Vibration (G)</th>
                          <th className="py-4 px-2 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Temp (°C)</th>
                          <th className="py-4 px-2 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Event</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {history.slice().reverse().map((entry, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-2 font-mono text-[11px] font-bold text-slate-500">{entry.timestamp}</td>
                          <td className={cn("py-3 px-2 font-mono text-[11px]", 
                            entry.current > 15 ? "text-red-600 font-bold" : 
                            entry.current > 13.5 ? "text-amber-600 font-bold" : 
                            entry.status === 'critical' ? "text-red-500/50" : "text-slate-600"
                          )}>
                            {entry.current}
                          </td>
                          <td className={cn("py-3 px-2 font-mono text-[11px]", 
                            entry.vibration > 0.08 ? "text-red-600 font-bold" : 
                            entry.vibration > 0.05 ? "text-amber-600 font-bold" : 
                            entry.status === 'critical' ? "text-red-500/50" : "text-slate-600"
                          )}>
                            {entry.vibration}
                          </td>
                          <td className={cn("py-3 px-2 font-mono text-[11px]", 
                            entry.temperature > 50 ? "text-red-600 font-bold" : 
                            entry.temperature > 38 ? "text-amber-600 font-bold" :
                            entry.status === 'critical' ? "text-red-500/50" : "text-slate-600"
                          )}>{entry.temperature}</td>
                          <td className="py-3 px-2">
                            <span className={cn(
                              "text-[8px] px-2 py-0.5 rounded font-bold uppercase",
                              entry.status === 'normal' ? "bg-emerald-50 text-emerald-600" :
                              entry.status === 'warning' ? "bg-amber-50 text-amber-600" :
                              "bg-red-600 text-white animate-pulse"
                            )}>
                              {entry.status}
                            </span>
                          </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
             <div className="card-nexus p-6 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-brand-primary" /> Configuration Details
                </h3>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payload Capacity</p>
                      {isEditing ? (
                        <input 
                          value={formData.loadCapacity}
                          onChange={e => setFormData({ ...formData, loadCapacity: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-brand-primary transition-colors"
                        />
                      ) : (
                        <p className="text-xs font-bold text-slate-700">{robot.loadCapacity}</p>
                      )}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Structural Service</p>
                      {isEditing ? (
                        <input 
                          type="date"
                          value={formData.lastService}
                          onChange={e => setFormData({ ...formData, lastService: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-brand-primary transition-colors"
                        />
                      ) : (
                        <p className="text-xs font-bold text-slate-700">{robot.lastService}</p>
                      )}
                   </div>
                   <div className="pt-4 mt-4 border-t border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Node Association</p>
                      <p className="text-[9px] font-mono text-slate-500 text-center uppercase tracking-widest">FABULOUS-FAB-UPLINK-{id?.slice(0, 8)}</p>
                   </div>
                </div>
             </div>

             <div className="card-nexus p-6 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <RefreshCcw size={18} className="text-emerald-500" /> Service Logs
                </h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      <div>
                         <p className="text-[11px] font-bold text-slate-700 uppercase">Weekly Calibration</p>
                         <p className="text-[10px] text-slate-400">MAY 12, 2026</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-1 shrink-0" />
                      <div>
                         <p className="text-[11px] font-bold text-slate-700 uppercase">Firmware Updated (v4.2.1)</p>
                         <p className="text-[10px] text-slate-400">APR 28, 2026</p>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-10 py-3 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all uppercase tracking-widest bg-white">
                  Schedule Maintenance
                </button>
             </div>

             <div className="card-nexus p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Cpu size={18} className="text-brand-primary" /> Logic Specs
                </h3>
                <div className="space-y-3 font-mono text-[10px]">
                   <div className="flex justify-between">
                      <span className="text-slate-400">CONTROLLER:</span>
                      <span className="text-slate-700">ARM-CORTEX-M7</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-400">ENCODERS:</span>
                      <span className="text-slate-700">14-BIT ABSOLUTE</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-400">BUS RATE:</span>
                      <span className="text-slate-700">1000HZ</span>
                   </div>
                </div>
             </div>

             <div className="card-nexus p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Play size={18} className="text-brand-primary" /> System Simulation
                </h3>
                <div className="space-y-3">
                   <button 
                     disabled={isOffline}
                     onClick={() => handleSimulate('current')}
                     className={cn(
                       "w-full py-2 px-3 rounded text-[10px] font-bold transition-all uppercase tracking-wider flex items-center justify-between group",
                       isOffline 
                         ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed" 
                         : activeSims.has('current')
                           ? "bg-red-600 text-white border-red-700 shadow-lg shadow-red-600/20"
                           : "bg-slate-50 hover:bg-brand-primary/10 border border-slate-200 hover:border-brand-primary/30 text-slate-600 hover:text-brand-primary"
                     )}
                   >
                     Simulate Current Overload
                     <Zap size={12} className={cn(!isOffline && (activeSims.has('current') ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"))} />
                   </button>
                   <button 
                     disabled={isOffline}
                     onClick={() => handleSimulate('vibration')}
                     className={cn(
                       "w-full py-2 px-3 rounded text-[10px] font-bold transition-all uppercase tracking-wider flex items-center justify-between group",
                       isOffline 
                         ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed" 
                         : activeSims.has('vibration')
                           ? "bg-red-600 text-white border-red-700 shadow-lg shadow-red-600/20"
                           : "bg-slate-50 hover:bg-brand-primary/10 border border-slate-200 hover:border-brand-primary/30 text-slate-600 hover:text-brand-primary"
                     )}
                   >
                     Simulate Vibration Delta
                     <Activity size={12} className={cn(!isOffline && (activeSims.has('vibration') ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"))} />
                   </button>
                   <button 
                     disabled={isOffline}
                     onClick={() => handleSimulate('temperature')}
                     className={cn(
                       "w-full py-2 px-3 rounded text-[10px] font-bold transition-all uppercase tracking-wider flex items-center justify-between group",
                       isOffline 
                         ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed" 
                         : activeSims.has('temperature')
                           ? "bg-red-600 text-white border-red-700 shadow-lg shadow-red-600/20"
                           : "bg-slate-50 hover:bg-brand-primary/10 border border-slate-200 hover:border-brand-primary/30 text-slate-600 hover:text-brand-primary"
                     )}
                   >
                     Simulate High Temperature
                     <AlertCircle size={12} className={cn(!isOffline && (activeSims.has('temperature') ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"))} />
                   </button>
                </div>
                <p className="mt-4 text-[9px] text-slate-400 font-mono italic"> Diagnostic mode: {isOffline ? 'Disabled for offline hardware.' : 'Use only for technician training.'}</p>
             </div>

             <div className="card-nexus p-6 bg-slate-50/50">
               <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <Users size={18} className="text-brand-primary" /> Maintenance Contact
               </h3>
               
               {/* 🤖 AGENT MODE CONTROL */}
               <div className={cn(
                 "mb-4 p-4 rounded-xl transition-all duration-500 relative overflow-hidden group",
                 isAgentMode ? "bg-slate-900 ring-1 ring-brand-primary/50" : "bg-slate-50 border border-slate-100"
               )}>
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                     <div className={cn(
                       "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                       isAgentMode ? "bg-brand-primary text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]" : "bg-slate-200 text-slate-500"
                     )}>
                       <Cpu size={16} className={isAgentMode ? "animate-pulse" : ""} />
                     </div>
                     <div>
                       <p className={cn("text-[10px] font-bold uppercase tracking-widest", isAgentMode ? "text-brand-primary" : "text-slate-400")}>
                         Agent Mode
                       </p>
                       <p className={cn("text-[11px] font-bold", isAgentMode ? "text-white" : "text-slate-600")}>
                         {isAgentMode ? "AUTONOMOUS ACTIVE" : "MANUAL INTERVENTION"}
                       </p>
                     </div>
                   </div>
                   <button 
                     onClick={() => {
                       const newState = !isAgentMode;
                       setIsAgentMode(newState);
                       if (newState) {
                         setLastAgentAction("Autonomous Mode Engaged. System active.");
                         setTimeout(() => setLastAgentAction(null), 3000);
                       } else {
                         setLastAgentAction(null);
                       }
                     }}
                     className={cn(
                       "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                       isAgentMode ? "bg-brand-primary" : "bg-slate-300"
                     )}
                   >
                     <span className={cn(
                       "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                       isAgentMode ? "translate-x-5" : "translate-x-0"
                     )} />
                   </button>
                 </div>
                 
                 <p className={cn("text-[10px] mt-3 leading-relaxed", isAgentMode ? "text-slate-400" : "text-slate-500")}>
                   When active, AI automatically contacts maintainers during critical faults.
                 </p>

                 {isAgentMode && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-3 pt-3 border-t border-slate-800"
                   >
                     {lastAgentAction ? (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="flex items-center gap-2 p-2 rounded bg-brand-primary/10 border border-brand-primary/30"
                       >
                         <CheckCircle2 size={12} className="text-brand-primary" />
                         <span className="text-[9px] font-bold text-brand-primary uppercase">
                           {lastAgentAction}
                         </span>
                       </motion.div>
                     ) : (
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping" />
                         <span className="text-[8px] font-mono text-brand-primary uppercase tracking-[0.2em] font-bold italic">
                           Monitoring Live Telemetry...
                         </span>
                       </div>
                     )}
                   </motion.div>
                 )}
               </div>

               {/* 👷 ASSIGNMENT TRACKER */}
               <AnimatePresence>
                 {assignedMaintainer && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mb-4"
                   >
                     <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-3 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                           <User size={20} />
                         </div>
                         <div>
                           <p className="text-[9px] font-bold text-brand-primary uppercase tracking-tighter">Currently Assigned</p>
                           <p className="text-sm font-bold text-slate-900">{assignedMaintainer}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => setAssignedMaintainer(null)}
                         className="p-1 hover:bg-brand-primary/10 rounded-md text-slate-400 hover:text-brand-primary transition-colors"
                         title="Clear Assignment"
                       >
                         <ShieldCheck size={16} />
                       </button>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="space-y-3">
                 {[
                   { name: 'John Doe', phone: '+1 (555) 012-3456' },
                   { name: 'Jane Doe', phone: '+1 (555) 012-7890' }
                 ].map((contact, i) => (
                   <motion.button
                     key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        handleContactMaintenance(contact.name, contact.phone);
                      }}
                      initial={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                      animate={activeSims.size > 0 ? {
                        backgroundColor: ['#ffffff', 'rgba(239, 68, 68, 0.1)', '#ffffff'],
                        borderColor: ['#e2e8f0', '#ef4444', '#e2e8f0'],
                      } : {
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                      }}
                      transition={activeSims.size > 0 ? {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                      } : {
                        duration: 0.3
                      }}
                      className={cn(
                        "w-full p-3 rounded-lg border flex items-center justify-between group hover:border-brand-primary relative z-30 cursor-pointer",
                        activeSims.size > 0 ? "border-red-200" : "border-slate-200"
                      )}
                   >
                     <div className="text-left">
                       <p className={cn("text-[11px] font-bold uppercase", activeSims.size > 0 ? "text-red-600" : "text-slate-700")}>{contact.name}</p>
                       <p className="text-[9px] text-slate-400 font-mono">{contact.phone}</p>
                     </div>
                     <div className={cn(
                       "p-2 rounded-full transition-colors",
                       activeSims.size > 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-primary/5"
                     )}>
                       <MessageSquare size={14} />
                     </div>
                   </motion.button>
                 ))}
               </div>
               {activeSims.size > 0 && (
                 <motion.p 
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-3 text-[9px] text-red-500 font-bold uppercase tracking-tighter text-center animate-pulse"
                 >
                   Action required: Contact dispatch
                 </motion.p>
               )}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MockMap = ({ address }: { address: string }) => {
  const coords = useMemo(() => {
    const addr = address.toLowerCase();
    if (addr.includes('newark')) return { lat: '37.5258', lng: '-122.0378', city: 'NEWARK HUB' };
    if (addr.includes('hayward')) return { lat: '37.6688', lng: '-122.0808', city: 'HAYWARD NODE' };
    if (addr.includes('san jose')) return { lat: '37.3382', lng: '-121.8863', city: 'SAN JOSE SITE' };
    if (addr.includes('fremont')) return { lat: '37.5483', lng: '-121.9886', city: 'FREMONT HQ' };
    return { lat: '37.4221', lng: '-122.0841', city: 'CALIFORNIA SECTOR' };
  }, [address]);

  return (
    <div className="w-full h-80 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-200 mt-6 flex-grow shadow-inner">
      {/* High-density grid lines */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }} />
      
      {/* Tactical Map Lines (Roads/Power Grids) */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <path d="M0 40 L800 40 M0 120 L800 120 M0 200 L800 200 M0 280 L800 280" stroke="#14b8a6" strokeWidth="1" />
        <path d="M60 0 L60 400 M180 0 L180 400 M300 0 L300 400 M420 0 L420 400" stroke="#14b8a6" strokeWidth="1" />
        <path d="M0 100 L150 100 L200 150 L400 150 L450 200 L800 200" fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="8 4" />
        <path d="M100 0 L100 150 L150 200 L150 400" fill="none" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* Focal Point / Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Pulse rings */}
        <motion.div 
          animate={{ scale: [1, 2], opacity: [0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
          className="w-16 h-16 rounded-full border border-brand-primary absolute -top-8 -left-8"
        />
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
          className="w-10 h-10 rounded-full border border-brand-primary absolute -top-5 -left-5"
        />
        
        {/* Central Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
             animate={{ y: [0, -4, 0] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <MapPin size={32} className="text-brand-primary fill-brand-primary/20 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
          </motion.div>
          <div className="w-2 h-2 bg-brand-primary rounded-full blur-[2px] mt-[-4px]" />
        </div>
      </div>

      {/* Technical UI Accents */}
      <div className="absolute top-3 left-3 bg-brand-primary/10 backdrop-blur-sm border border-brand-primary/20 px-2 py-1 rounded flex items-center gap-2">
        <div className="w-1 h-1 bg-brand-primary rounded-full animate-ping" />
        <span className="text-[9px] font-mono font-bold text-brand-primary uppercase tracking-tighter">Node: {coords.city} // Active</span>
      </div>

      <div className="absolute bottom-3 right-3 bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-md text-[9px] font-mono text-slate-300 border border-slate-700 flex flex-col items-end shadow-xl">
        <span className="text-brand-primary">COORDS: {coords.lat}, {coords.lng}</span>
        <span className="opacity-50">RADIUS: 5.2KM ACCURACY</span>
      </div>
    </div>
  );
};


const FabView = ({ 
  fabs, 
  onUpdate, 
  isNew = false 
}: { 
  fabs: Fab[]; 
  onUpdate: (fab: Fab) => void;
  isNew?: boolean;
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existingFab = fabs.find(f => f.id === id);
  const [isEditing, setIsEditing] = useState(isNew);
  
  const [formData, setFormData] = useState<Partial<Fab>>({
    name: '',
    address: '48400 Kato Rd, Fremont, CA 94538',
    capacity: '0 WPM',
    status: 'planned',
    description: ''
  });

  // Sync state if existingFab changes or when entering edit mode
  useEffect(() => {
    if (existingFab) {
      setFormData(existingFab);
    } else if (isNew) {
      setFormData({
        name: '',
        address: '48400 Kato Rd, Fremont, CA 94538',
        capacity: '0 WPM',
        status: 'planned',
        description: ''
      });
    }
  }, [existingFab, isNew, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: Fab = {
      id: isNew ? Math.random().toString(36).substring(2, 9) : id!,
      name: formData.name || 'New Facility',
      address: formData.address || 'Fremont, CA',
      capacity: formData.capacity || '0 WPM',
      status: formData.status || 'planned',
      description: formData.description || ''
    };
    onUpdate(result);
    setIsEditing(false);
    if (isNew) navigate(`/fab/${result.id}`);
  };

  const handleCancel = () => {
    if (isNew) {
      navigate('/');
    } else {
      setIsEditing(false);
      if (existingFab) setFormData(existingFab);
    }
  };

  return (
    <motion.div
      key={isNew ? 'new' : id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      {/* Sticky Action Bar for Edit Mode */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-brand-primary/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between px-4 sm:px-8 py-3 shadow-md shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <Settings size={18} className="animate-spin-slow" />
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration Mode</p>
                <p className="text-sm font-bold text-slate-800 truncate">{isNew ? 'Integrating New Terminal' : `Editing: ${existingFab?.name}`}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-slate-100 text-slate-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-fab-btn"
                type="button"
                onClick={() => {
                  const form = document.querySelector('form') as HTMLFormElement;
                  if (form) form.requestSubmit();
                }}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-2 bg-brand-primary text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Save size={14} className="sm:w-4 sm:h-4" />
                {isNew ? 'Initialize Node' : 'Sync Changes'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {!isEditing && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {formData.name}
                </h2>
                <p className="text-slate-500 mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-2">
                  Registry Node: <span className="text-brand-primary font-bold">{`FAB-00${id?.slice(0, 2)}`}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white text-slate-300 hover:text-brand-primary hover:border-brand-primary shadow-sm flex items-center justify-center transition-all shrink-0 self-end sm:self-auto"
              >
                <Settings size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="card-nexus p-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity size={12} className="text-brand-primary" /> Facility Name
                  </label>
                  {isEditing ? (
                    <input
                      required
                      id="fab-name-input"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-nexus text-lg font-semibold text-slate-800"
                      placeholder="e.g. Silicon Peak Alpha"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-slate-800 px-1">{formData.name || '---'}</div>
                  )}
                </div>

                <div className="card-nexus p-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap size={12} className="text-brand-primary" /> Capacity (Wafers/Month)
                  </label>
                  {isEditing ? (
                    <input
                      required
                      id="fab-capacity-input"
                      value={formData.capacity}
                      onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                      className="input-nexus text-lg font-mono text-slate-800"
                      placeholder="e.g. 45,000 WPM"
                    />
                  ) : (
                    <div className="text-lg font-mono text-slate-800 px-1">{formData.capacity || '---'}</div>
                  )}
                </div>

                <div className="card-nexus p-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     Network Status
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2">
                       {(['active', 'maintenance', 'planned'] as const).map((status) => (
                         <button
                           key={status}
                           type="button"
                           onClick={() => setFormData({ ...formData, status })}
                           className={cn(
                             "py-2 px-1 rounded-lg border text-[9px] uppercase font-bold transition-all",
                             formData.status === status 
                               ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20" 
                               : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                           )}
                         >
                           {status}
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-3 py-1 rounded-full uppercase font-bold",
                        formData.status === 'active' ? "bg-emerald-500 text-white" : 
                        formData.status === 'maintenance' ? "bg-amber-500 text-white" : 
                        "bg-slate-400 text-white"
                      )}>
                        {formData.status}
                      </span>
                    </div>
                  )}
                </div>

                {!isNew && !isEditing && (
                  <div className="card-nexus p-6 bg-slate-50/30">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={12} className="text-brand-primary" /> Robot Observability
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-primary/10 rounded-md text-brand-primary">
                            <Bot size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Fleet Telemetry</p>
                            <p className="text-[10px] text-slate-400 font-mono">NODE-ROB-{id?.slice(0, 4)}</p>
                          </div>
                        </div>
                        <Link 
                          to={`/fab/${id}/robots`}
                          className="text-[10px] font-bold text-brand-primary hover:text-brand-primary-hover uppercase tracking-wider flex items-center gap-1 group"
                        >
                          Launch Console
                          <ChevronLeft size={12} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="card-nexus p-6 h-full flex flex-col">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin size={12} className="text-brand-primary" /> Physical Address
                  </label>
                  {isEditing ? (
                    <textarea
                      required
                      id="fab-address-input"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="input-nexus h-32 resize-none leading-relaxed text-slate-700"
                      placeholder="Facility location in Bay Area (Fremont, Newark, Hayward, San Jose)"
                    />
                  ) : (
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap flex-1 px-1">{formData.address || '---'}</div>
                  )}
                  
                  <MockMap address={formData.address || ''} />

                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-medium uppercase">Verified Geolocation Status</span>
                  </div>
                </div>

                <div className="card-nexus p-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Internal Protocol Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      id="fab-description-input"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="input-nexus h-32 resize-none leading-relaxed text-slate-700"
                      placeholder="Facility specialization details..."
                    />
                  ) : (
                    <div className="text-slate-700 leading-relaxed italic whitespace-pre-wrap px-1">{formData.description || 'No system notes recorded.'}</div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const RobotHealthDashboard = ({ fabs, robots }: { fabs: Fab[], robots: Robot[] }) => {
  const stats = useMemo(() => {
    const total = robots.length;
    const operational = robots.filter(r => r.status === 'operational').length;
    const error = robots.filter(r => r.status === 'error').length;
    const offline = robots.filter(r => r.status === 'offline').length;
    
    const statusData = [
      { name: 'Operational', value: operational, color: '#10b981' },
      { name: 'Critical Fault', value: error, color: '#ef4444' },
      { name: 'Offline', value: offline, color: '#94a3b8' }
    ].filter(d => d.value > 0);

    const fabDistribution = fabs.map(f => ({
      name: f.name.split(' ')[0], // Short name
      count: robots.filter(r => r.fabId === f.id).length
    })).filter(f => f.count > 0);

    return { total, operational, error, offline, statusData, fabDistribution };
  }, [robots, fabs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50/50"
    >
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
              <LayoutDashboard size={24} className="text-brand-primary shrink-0 sm:w-8 sm:h-8" />
              Robot Health Dashboard
            </h2>
            <p className="text-slate-500 mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">
              Fleet aggregation spanning <span className="text-brand-primary font-bold">{fabs.length}</span> facilities
            </p>
          </div>
          <div className="flex items-center self-start sm:self-auto shrink-0">
             <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Link Active</span>
             </div>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-nexus p-4 sm:p-6 bg-white border-l-4 border-l-brand-primary">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Fleet Size</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-1">
               <Bot size={12} className="text-brand-primary" /> Across all nodes
            </p>
          </div>
          <div className="card-nexus p-4 sm:p-6 bg-white border-l-4 border-l-emerald-500">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Healthy Units</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.operational}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
               {((stats.operational / stats.total) * 100).toFixed(1)}% availability
            </p>
          </div>
          <div className="card-nexus p-4 sm:p-6 bg-white border-l-4 border-l-red-500">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Critical Alerts</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.error}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-1 uppercase tracking-tight">
               <AlertCircle size={12} /> Immediate focus required
            </p>
          </div>
          <div className="card-nexus p-4 sm:p-6 bg-white border-l-4 border-l-slate-400">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Maintenance Queue</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-600">{stats.offline}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
               Decommissioned / Repair
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Status Distribution */}
          <div className="card-nexus p-4 sm:p-6 lg:p-8 bg-white">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
              <PieChartIcon size={16} className="text-brand-primary sm:w-[18px] sm:h-[18px]" /> Fleet Health Distribution
            </h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                     itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fab Distribution */}
          <div className="card-nexus p-4 sm:p-6 lg:p-8 bg-white">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-primary sm:w-[18px] sm:h-[18px]" /> Units per Facility
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.fabDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                     cursor={{ fill: 'rgba(20, 184, 166, 0.05)' }}
                     contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Full Fleet Table */}
        <div className="card-nexus bg-white overflow-hidden shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Global Fleet Manifest</h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Snapshot: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Model / SN</th>
                  <th className="py-4 px-6 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Facility Location</th>
                  <th className="py-4 px-6 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                  <th className="py-4 px-6 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {robots.map((robot) => {
                  const fab = fabs.find(f => f.id === robot.fabId);
                  return (
                    <tr key={robot.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            robot.status === 'error' ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-400"
                          )}>
                            <Bot size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{robot.model}</p>
                            <p className="text-[9px] font-mono text-slate-400 uppercase">{robot.serialNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-slate-300" />
                          <span className="text-xs text-slate-600 font-medium">{fab?.name || 'Unknown Node'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                         <span className={cn(
                           "text-[9px] px-2 py-0.5 rounded-full uppercase font-bold inline-flex items-center gap-1",
                           robot.status === 'operational' ? "bg-emerald-500 text-white" : 
                           robot.status === 'error' ? "bg-red-500 text-white animate-pulse" : 
                           "bg-slate-400 text-white"
                         )}>
                           {robot.status}
                         </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          to={`/fab/${robot.fabId}/robots/${robot.id}`}
                          className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest"
                        >
                          Telemetry Feed
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [fabs, setFabs] = useState<Fab[]>(() => {
    const saved = localStorage.getItem('fab_network_data');
    return saved ? JSON.parse(saved) : INITIAL_FABS;
  });

  const [robots, setRobots] = useState<Robot[]>(() => {
    const saved = localStorage.getItem('robot_fleet_data');
    return saved ? JSON.parse(saved) : INITIAL_ROBOTS;
  });

  useEffect(() => {
    localStorage.setItem('fab_network_data', JSON.stringify(fabs));
  }, [fabs]);

  useEffect(() => {
    localStorage.setItem('robot_fleet_data', JSON.stringify(robots));
  }, [robots]);

  const handleUpdateRobot = (updatedRobot: Robot) => {
    setRobots(prev => prev.map(r => r.id === updatedRobot.id ? updatedRobot : r));
  };

  const handleAddRobot = (fabId: string) => {
    const newRobot: Robot = {
      id: Math.random().toString(36).substr(2, 9),
      fabId,
      model: 'FANUC R-2000iC',
      serialNumber: `SN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'operational',
      lastService: new Date().toISOString().split('T')[0],
      loadCapacity: '210kg'
    };
    setRobots(prev => [...prev, newRobot]);
  };

  const handleDeleteRobot = (id: string) => {
    if (window.confirm('Decommission this unit? Hardware will be disconnected from fleet registry.')) {
      setRobots(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUpdate = (updatedFab: Fab) => {
    setFabs(prev => {
      const index = prev.findIndex(f => f.id === updatedFab.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedFab;
        return next;
      }
      return [updatedFab, ...prev];
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Confirm decommissioning of this node? Connectivity will be terminated.')) {
      setFabs(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset network registry to default global configuration? Any custom nodes will be lost.')) {
      setFabs([...INITIAL_FABS]);
      localStorage.removeItem('fab_network_data');
      alert('Network registry has been reset to default configuration.');
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col h-screen w-full bg-brand-bg font-sans overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Mobile Sidebar off-canvas & Drawer */}
        <div 
          className={cn(
            "fixed inset-y-0 left-0 z-40 lg:static lg:flex transform transition-transform duration-300 ease-in-out shrink-0 bg-white shadow-2xl lg:shadow-none h-full",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <Sidebar 
            fabs={fabs} 
            onDelete={handleDelete} 
            onReset={handleReset} 
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Backdrop for mobile overlays */}
        {sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden focus:outline-none cursor-default w-full h-full"
            aria-label="Close Sidebar"
          />
        )}

        <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
          <Routes>
            <Route 
              path="/" 
              element={<FabViewPlaceholder />} 
            />
            <Route 
              path="/dashboard" 
              element={<RobotHealthDashboard fabs={fabs} robots={robots} />} 
            />
            <Route 
              path="/new" 
              element={<FabView fabs={fabs} onUpdate={handleUpdate} isNew={true} />} 
            />
            <Route 
              path="/fab/:id" 
              element={<FabView fabs={fabs} onUpdate={handleUpdate} />} 
            />
            <Route 
              path="/fab/:id/robots" 
              element={<RobotList robots={robots} onAddRobot={handleAddRobot} onDeleteRobot={handleDeleteRobot} />} 
            />
            <Route 
              path="/fab/:id/robots/:robotId" 
              element={<RobotDetail robots={robots} onUpdateRobot={handleUpdateRobot} onDeleteRobot={handleDeleteRobot} />} 
            />
          </Routes>

          <footer className="h-12 border-t border-brand-border bg-white px-8 flex items-center justify-between shrink-0 z-10">
            <div className="flex gap-6 text-[10px] font-bold text-slate-400 font-mono tracking-wider">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> ALL SYSTEMS NOMINAL</span>
              <span className="hidden xs:inline">LATENCY: 14MS</span>
              <span className="hidden sm:inline">UPLINK: SECURE</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">© 2026 FABULOUS FAB OBSERVER</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
