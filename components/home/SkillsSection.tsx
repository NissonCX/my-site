import { skills, skillCategories } from '@/data';
import { SectionTitle } from '@/components/layout';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

export function SkillsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="技术栈"
          subtitle="我的主要技术能力和工具"
          align="center"
        />

        <div className="mt-8 space-y-8">
          {skillCategories.map((category) => {
            const categorySkills = skills.filter(
              (s) => s.category === category.key
            );
            if (categorySkills.length === 0) return null;

            return (
              <div key={category.key} className="text-center">
                <h3 className="text-sm font-medium text-hint mb-3">
                  {category.label}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {categorySkills.map((skill) => (
                    <Tag
                      key={skill.name}
                      variant="default"
                      size="md"
                      className={cn(
                        skill.level === 'expert' && 'bg-accent/10 text-accent',
                        skill.level === 'proficient' && 'bg-muted text-foreground'
                      )}
                    >
                      {skill.name}
                    </Tag>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}