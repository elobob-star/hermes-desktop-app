import React, { useState, useMemo } from 'react';
import './Skills.css';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

const MOCK_SKILLS: Skill[] = [
  { id: 'code-review', name: 'Code Review', description: 'Review code for issues', category: 'Dev', icon: '🔍' },
  { id: 'web-search', name: 'Web Search', description: 'Search the web for information', category: 'Research', icon: '🌐' },
  { id: 'image-generate', name: 'Generate Image', description: 'Generate images from text', category: 'Media', icon: '🎨' },
  { id: 'terminal-exec', name: 'Terminal Execution', description: 'Execute terminal commands', category: 'Dev', icon: '💻' },
  { id: 'file-organize', name: 'Organize Files', description: 'Organize and manage files', category: 'Productivity', icon: '📁' },
  { id: 'email-send', name: 'Send Email', description: 'Send emails via SMTP', category: 'Productivity', icon: '📧' },
  { id: 'data-analyze', name: 'Analyze Data', description: 'Analyze and visualize data', category: 'Data', icon: '📊' },
  { id: 'api-test', name: 'Test API', description: 'Test API endpoints', category: 'Dev', icon: '🔌' },
];

const CATEGORIES = ['All', 'Dev', 'Data', 'Media', 'Productivity', 'Research'];

export const Skills: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = useMemo(() => {
    return MOCK_SKILLS.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="skills-container">
      <header className="skills-header">
        <input
          type="text"
          className="skills-search theme-transition"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="skills-filters">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`filter-chip theme-transition ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <div className="skills-grid">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="skill-card theme-transition">
            <div className="skill-card-header">
              <span className="skill-icon">{skill.icon}</span>
              <span className={`skill-category-badge category-${skill.category.toLowerCase()}`}>
                {skill.category}
              </span>
            </div>
            <h3 className="skill-name">{skill.name}</h3>
            <p className="skill-description">{skill.description}</p>
            <button
              className="skill-run-btn theme-transition"
              onClick={() => console.log(`Running skill: ${skill.id}`)}
            >
              Run
            </button>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="skills-empty-state">
          No skills found matching your criteria.
        </div>
      )}
    </div>
  );
};
