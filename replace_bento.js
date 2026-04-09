const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newHero = `
      {/* Bento Grid Hero */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[500px]">
          
          {/* Main Profile Box (Spans 2x2) */}
          <div
            className={\`md:col-span-2 md:row-span-2 card-paper p-8 flex flex-col justify-between relative overflow-hidden group opacity-0 transition-all duration-700 \${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10'}\`}
            style={{ animationDelay: '0.1s' }}
          >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
            
            <div className="z-10 relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-elevated mb-6">
                <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <p className="font-mono text-xs text-hint tracking-widest uppercase mb-3">{personal.title}</p>
              <h1 className="text-3xl md:text-4xl font-serif text-foreground font-bold mb-4">{personal.name}</h1>
              <p className="text-secondary text-sm md:text-base leading-relaxed max-w-md">{personal.bio}</p>
            </div>
            
            <div className="flex items-center gap-3 mt-8 z-10 relative">
              <SocialLinks links={socialLinks} className="-ml-2" />
            </div>
          </div>

          {/* FC Barcelona / Messi Box */}
          <div
            className={\`md:col-span-2 md:row-span-1 card-paper p-6 relative overflow-hidden group opacity-0 transition-all duration-700 \${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10'}\`}
            style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, rgba(0,77,152,0.9) 0%, rgba(165,0,68,0.9) 100%)' }}
          >
            {/* Decorative Icon */}
            <div className="absolute right-[-10px] bottom-[-20px] text-white/10 text-[8rem] font-serif italic font-bold transform -rotate-12 transition-transform duration-700 group-hover:scale-110 pointer-events-none">10</div>
            
            <div className="relative z-10 text-white h-full flex flex-col justify-center">
              <h3 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                <span>Més que un club</span>
                <span className="text-[10px] px-2 py-0.5 border border-white/30 bg-white/10 rounded-full font-mono backdrop-blur-sm tracking-wider">FCB</span>
              </h3>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-[90%]">
                理想主义与殉道者。这是他们对传控哲学的执着坚守。而梅西，则是足球的本身。
              </p>
            </div>
          </div>

          {/* Music / Now Playing Box */}
          <div
            className={\`md:col-span-1 md:row-span-1 card-paper p-6 flex flex-col items-center justify-center relative overflow-hidden group opacity-0 transition-all duration-700 \${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10'}\`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="absolute inset-0 transition-colors duration-500 group-hover:bg-muted/30" />
            <div className="z-10 relative flex flex-col items-center">
              {/* Spinning Record */}
              <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center shadow-inner bg-accent/5 mb-3 group-hover:animate-[spin_4s_linear_infinite]">
                 <svg className="w-5 h-5 text-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                 </svg>
              </div>
              <h4 className="font-serif text-sm font-bold text-foreground">粤语 & 李宗盛</h4>
              
              {/* Audio Bars */}
              <div className="flex gap-1 mt-4 h-4 items-end justify-center w-full">
                <div className="w-1 bg-accent/60 rounded-t-sm h-full group-hover:animate-[bounce_0.8s_infinite]" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 bg-accent/80 rounded-t-sm h-2/3 group-hover:animate-[bounce_1.1s_infinite]" style={{animationDelay: '0.3s'}}></div>
                <div className="w-1 bg-accent rounded-t-sm h-1/2 group-hover:animate-[bounce_0.6s_infinite]" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 bg-accent/80 rounded-t-sm h-4/5 group-hover:animate-[bounce_0.9s_infinite]" style={{animationDelay: '0.4s'}}></div>
                <div className="w-1 bg-accent/60 rounded-t-sm h-1/3 group-hover:animate-[bounce_1s_infinite]" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>

          {/* Explore / Read More Box */}
          <div
            className={\`md:col-span-1 md:row-span-1 opacity-0 transition-all duration-700 \${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10'}\`}
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href="/about"
              className="card-paper p-6 h-full flex flex-col justify-between group hover:border-accent/30 transition-colors duration-500 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent transform group-hover:scale-110 group-hover:bg-accent group-hover:text-background transition-all duration-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground mb-1">关于代码之外</h4>
                <p className="text-xs text-secondary opacity-70">点击阅读更多</p>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 分割线 */}
      <div className="divider max-w-6xl mx-auto opacity-50" />
`;

const heroStart = '<section className="relative min-h-[90vh] flex items-center">';
const splitStart = '{/* 分割线 */}';
const splitEnd = '<div className="divider max-w-6xl mx-auto" />';

const startIndex = content.indexOf(heroStart);
const endIndex = content.indexOf(splitEnd) + splitEnd.length;

if(startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newHero + content.substring(endIndex);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Success");
} else {
  console.log("Failed to locate indices");
}
