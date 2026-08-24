import React from 'react';
import { Compass, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceViewProps {
  experiences: Experience[];
  onBookExperience: (exp: Experience) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({ experiences, onBookExperience }) => {
  return (
    <div id="experience-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Guided Tours &amp; Local Travel Experiences</h2>
        <p className="text-xs text-slate-500">Unforgettable activities, cooking workshops, adventure flights &amp; certified local guides</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="h-52 relative overflow-hidden">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" /> {exp.rating} ({exp.reviewsCount})
                </span>
                <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl uppercase">
                  {exp.category}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">{exp.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {exp.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {exp.duration}</span>
                </div>

                <div className="space-y-1 pt-1">
                  {exp.highlights.map((hl, i) => (
                    <p key={i} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                      <span className="text-orange-500 font-bold">•</span> {hl}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
              <div>
                <span className="text-2xl font-extrabold text-orange-600">${exp.pricePerPerson}</span>
                <span className="text-xs text-slate-500"> / person</span>
              </div>
              <button
                onClick={() => onBookExperience(exp)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Book Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
