import React, { useState } from 'react';
import { Code2, Database, ShieldCheck, Server, Layers, Copy, Check, Terminal } from 'lucide-react';

export const ArchitectureDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'folder' | 'database' | 'api' | 'security' | 'deploy'>('folder');
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sqlSchemaDDL = `-- VoyageGo Production PostgreSQL Database DDL
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
    voyage_coins INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    booking_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmed',
    travel_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin_code VARCHAR(10) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    seats_available INT DEFAULT 180
);`;

  return (
    <div id="architecture-docs-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-orange-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md">
            Enterprise System Architecture
          </span>
          <h2 className="text-2xl font-extrabold mt-1">Python FastAPI + PostgreSQL Blueprint</h2>
          <p className="text-xs text-slate-400">Production-ready folder layout, database models, REST API specifications &amp; deployment guide</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['folder', 'database', 'api', 'security', 'deploy'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === tab ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Folder Structure */}
      {activeTab === 'folder' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" /> Monorepo Folder Structure Architecture
          </h3>
          <pre className="bg-slate-950 text-emerald-400 p-5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`voyagego-platform/
├── frontend/                     # React 19 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── flight/           # Flight Booking & Seat Selector
│   │   │   ├── hotel/            # Hotel Search & Room Reservation
│   │   │   ├── homestay/         # Vacation Rentals & Villas
│   │   │   ├── package/          # All-Inclusive Holiday Packages
│   │   │   ├── bus/              # Sleeper Bus & Seat Map Layout
│   │   │   ├── train/            # IRCTC Railway Engine & PNR Checker
│   │   │   ├── cab/              # Outstation Cabs & Airport Transfers
│   │   │   ├── experience/       # Guided Tours & Activities
│   │   │   ├── visa/             # E-Visa Checklist & Insurance
│   │   │   ├── ai/               # AI Trip Planner (Gemini 3.6 Flash)
│   │   │   ├── admin/            # Commercial Admin Portal
│   │   │   └── checkout/         # Unified Booking Checkout Modal
│   │   ├── data/                 # Seed Data & System Mocks
│   │   └── types.ts              # Shared TypeScript Contracts
├── backend/                      # Python FastAPI Enterprise Backend
│   ├── app/
│   │   ├── api/v1/               # REST API Endpoints (Flights, Hotels, AI)
│   │   ├── core/                 # Security, JWT, Rate Limiter & Config
│   │   ├── db/                   # SQLAlchemy Models & Migrations
│   │   ├── schemas/              # Pydantic Request/Response Models
│   │   ├── services/             # Business Logic & Gemini AI Service
│   │   └── main.py               # FastAPI App Entrypoint
└── docker-compose.yml            # PostgreSQL + Redis + FastAPI Container Config`}
          </pre>
        </div>
      )}

      {/* Tab 2: Database Schema */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-500" /> PostgreSQL Relational DDL Schema
            </h3>
            <button
              onClick={() => copyToClipboard(sqlSchemaDDL)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied DDL' : 'Copy SQL Schema'}
            </button>
          </div>
          <pre className="bg-slate-950 text-amber-300 p-5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            {sqlSchemaDDL}
          </pre>
        </div>
      )}

      {/* Tab 3: API Specification */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-orange-500" /> REST API Open-API Endpoint Matrix
          </h3>
          <div className="space-y-2 text-xs font-mono">
            {[
              { method: 'POST', endpoint: '/api/v1/auth/login', desc: 'Authenticate user & issue JWT Bearer Access Token' },
              { method: 'POST', endpoint: '/api/v1/ai/plan-trip', desc: 'Generate day-by-day AI itinerary using Gemini 3.6 Flash' },
              { method: 'GET', endpoint: '/api/v1/flights/search', desc: 'Search flights by origin, destination, date & cabin class' },
              { method: 'POST', endpoint: '/api/v1/bookings/create', desc: 'Create confirmed booking record with PNR generation' },
              { method: 'GET', endpoint: '/api/v1/admin/metrics', desc: 'Get real-time commercial revenue metrics (RBAC Required)' },
            ].map((api, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${api.method === 'POST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {api.method}
                  </span>
                  <strong className="text-slate-900">{api.endpoint}</strong>
                </div>
                <span className="text-slate-500 font-sans text-xs">{api.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security & RBAC */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise Security &amp; Compliance Safeguards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-extrabold text-slate-900">JWT Authentication &amp; OAuth 2.0</h4>
              <p>Cryptographically signed RSA-256 JWT tokens with 15-minute expiration and HTTP-only refresh cookies.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-extrabold text-slate-900">SQL Injection &amp; XSS Protection</h4>
              <p>SQLAlchemy ORM parameterized queries prevent injection attacks; React DOM automatic escaping stops XSS.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Production Deployment */}
      {activeTab === 'deploy' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-500" /> Production Cloud Run &amp; Kubernetes Deployment
          </h3>
          <p className="text-xs text-slate-600">
            Containerized build pipeline deploying Node/Python microservices to Google Cloud Run with automated SSL and auto-scaling.
          </p>
        </div>
      )}
    </div>
  );
};
