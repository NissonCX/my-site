const fs = require('fs');
const content = fs.readFileSync('components/home/HeroSection.tsx', 'utf8');

const regex = /\{\/\* 右侧：经典人像区域修复 \(解决诡异感\) \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const replacement = `{/* 右侧：正常展示头像 */}
            <div 
              className="flex-shrink-0 animate-scale-in opacity-0 pt-8 md:mt-0 flex justify-center w-full md:w-auto" 
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl relative ring-1 ring-border/20 mx-auto group">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>`;

const newContent = content.replace(regex, replacement);
fs.writeFileSync('components/home/HeroSection.tsx', newContent);
console.log('Fixed avatar section');
