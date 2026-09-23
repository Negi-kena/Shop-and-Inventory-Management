import React from 'react';
import { 
  X, 
  ShoppingCart, 
  Package, 
  Building2, 
  ShieldCheck, 
  Wifi, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useApp();

  if (!isOpen) return null;

  const content = {
    en: {
      title: 'How Addis Retail Works',
      subtitle: 'A simple guide for your electronics & solar shop',
      points: [
        {
          icon: <ShoppingCart className="w-5 h-5 text-amber-400" />,
          title: '1. Fast Mobile Selling (POS)',
          desc: 'Tap products to add them to your cart. Select Telebirr, Cash, CBE Birr, or Bank Transfer. Hand customer an instant printable receipt or share it via Telegram/SMS.',
        },
        {
          icon: <Package className="w-5 h-5 text-emerald-400" />,
          title: '2. Track Shop Inventory',
          desc: 'Know exactly how many solar panels, batteries, speakers, and cables are in your shop. Get instant yellow/red warnings when stock is low.',
        },
        {
          icon: <Building2 className="w-5 h-5 text-purple-400" />,
          title: '3. Supplier Balances (Consignment)',
          desc: 'Often suppliers or partner shops give you items to sell before paying them. Track these obligations separately. When you sell them, record your settlement payment to the supplier here. (Note: The shop does NOT give customer credit).',
        },
        {
          icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
          title: '4. Owner Mode vs Sales Staff',
          desc: 'Switch between Owner (can see profit margins, costs, and edit settings) and Sales Staff (fast selling and stock lookup without seeing wholesale costs).',
        },
        {
          icon: <Wifi className="w-5 h-5 text-teal-400" />,
          title: '5. Works 100% Offline',
          desc: 'Power cut or internet down? Everything continues working locally on your smartphone and queues up safely.',
        }
      ],
      gotIt: 'Got it, let\'s start!',
    },
    am: {
      title: 'አዲስ ሪቴይል እንዴት ይሰራል?',
      subtitle: 'ለኤሌክትሮኒክስ እና ሶላር ሱቆች የተዘጋጀ ቀላል መመሪያ',
      points: [
        {
          icon: <ShoppingCart className="w-5 h-5 text-amber-400" />,
          title: '1. ፈጣን ሽያጭ (POS)',
          desc: 'ዕቃዎችን በመንካት ወደ ቅርጫት ያስገቡ። በቴሌብር፣ ጥሬ ገንዘብ፣ ሲቢኢ ብር ወይም በባንክ ክፍያ ይቀበሉ። ወዲያውኑ የደረሰኝ ኮፒ ለደንበኛው በቴሌግራም/ኤስኤምኤስ ይላኩ።',
        },
        {
          icon: <Package className="w-5 h-5 text-emerald-400" />,
          title: '2. የዕቃ ክምችት መቆጣጠሪያ',
          desc: 'በሱቅዎ ውስጥ ያሉ የሶላር ፓነሎች፣ ባትሪዎች፣ ስፒከሮች እና ኬብሎች ብዛት በግልጽ ይወቁ። ዕቃ ሊያልቅ ሲል ቢጫ ወይም ቀይ ማስጠንቀቂያ ያሳውቅዎታል።',
        },
        {
          icon: <Building2 className="w-5 h-5 text-purple-400" />,
          title: '3. የአቅራቢ ዕዳዎችና ኮንሳይንመንት',
          desc: 'ከአቅራቢዎች ወይም ከጎረቤት ሱቆች ከፍለው ያልጨረሱትን ዕቃ ለብቻ ይከታተሉ። ሲሸጡ ለአቅራቢው የከፈሉትን እዚህ ይመዝግቡ። (ማስታወሻ፡ ሱቃችን ለደንበኛ በብድር አይሸጥም)።',
        },
        {
          icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
          title: '4. የባለቤት እና የሰራተኛ ሚና',
          desc: 'በባለቤት (የትርፍ ህዳግ እና የጅምላ ዋጋ የሚያይ) እና በሻጭ ሰራተኛ (ሽያጭና እቃ ቆጠራ ብቻ) መካከል በቀላሉ ይቀያይሩ።',
        },
        {
          icon: <Wifi className="w-5 h-5 text-teal-400" />,
          title: '5. ያለ ኢንተርኔት (ኦፍላይን) ይሰራል',
          desc: 'መብራት ወይም ኔትወርክ ቢጠፋም ስልክዎ ላይ ያለ ችግር ሽያጭዎን ይቀጥሉ።',
        }
      ],
      gotIt: 'ገባኝ፣ እንጀምር!',
    },
    om: {
      title: 'Akkaataa Addis Retail Hojjatu',
      subtitle: 'Qajeelfama salphaa suuqii elektirooniksii fi soolaariitiif',
      points: [
        {
          icon: <ShoppingCart className="w-5 h-5 text-amber-400" />,
          title: '1. Gurgurtaa Saffisaa (POS)',
          desc: 'Meeshaalee tuquun gara kaariitti galchaa. Kaffaltii Telebirr, Qaraashii, CBE Birr ykn Baankiin fudhadhaa. Yeruma sana nagahee maamiilaaf ergaa.',
        },
        {
          icon: <Package className="w-5 h-5 text-emerald-400" />,
          title: '2. Qabeenya Suuqii To\'achuu',
          desc: 'Paanaalota soolaarii, baatrii, ispiikeraa fi keebiloota meeqa akka qabdan beekaa. Yeroo dhumuutti dhihaatu akeekkachiisa kenna.',
        },
        {
          icon: <Building2 className="w-5 h-5 text-purple-400" />,
          title: '3. Liqii Dhiyeessitootaa (Koonsaayinmentii)',
          desc: 'Meeshaalee dhiyeessitoota irraa kaffaltii malee fudhattan addatti to\'adhaa. Yeroo gurgurtan kaffaltii isaanii galmeessaa. (Hubachiisa: Suuqichi maamiilaaf liqiin hin gurguru).',
        },
        {
          icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
          title: '4. Abbaa Qabeenyaa fi Hojjetaa',
          desc: 'Gidduu Abbaa Qabeenyaa (bu\'aa fi gatii bittaa argu) fi Hojjetaa (gurgurtaa qofa) salphaatti jijjiiraa.',
        },
        {
          icon: <Wifi className="w-5 h-5 text-teal-400" />,
          title: '5. Intarneetii Malee Hojjata',
          desc: 'Ibsaan yoo bade ykn intarneetiin yoo dhabame, bilbila keessan irratti ammas hojjata.',
        }
      ],
      gotIt: 'Naaf galeera, haa jalqabnu!',
    }
  };

  const current = content[language] || content.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white leading-tight">
                {current.title}
              </h2>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                {current.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700 active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Points */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-200">
          {current.points.map((point, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 shadow-sm"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                {point.icon}
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-white leading-snug">
                  {point.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-sm rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{current.gotIt}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
