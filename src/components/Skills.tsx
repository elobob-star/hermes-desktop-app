import React, { useState, useMemo, useCallback } from 'react';
import { useHermes } from '../hooks/useHermes';
import './Skills.css';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: 'web-search', name: 'Web Search', description: 'Search the web for information', category: 'Research', icon: '🌐', prompt: 'Search the web for:' },
  { id: 'terminal-exec', name: 'Terminal Execution', description: 'Execute terminal commands safely', category: 'Dev', icon: '💻', prompt: 'Execute this terminal command:' },
  { id: 'file-search', name: 'Search Files', description: 'Search for files and content', category: 'Productivity', icon: '📁', prompt: 'Search for files matching:' },
  { id: 'email-send', name: 'Send Email', description: 'Send emails via configured SMTP', category: 'Productivity', icon: '📧', prompt: 'Send an email:' },
  { id: 'data-analyze', name: 'Analyze Data', description: 'Analyze and visualize data sets', category: 'Data', icon: '📊', prompt: 'Analyze this data:' },
  { id: 'api-test', name: 'Test API', description: 'Test and debug API endpoints', category: 'Dev', icon: '🔌', prompt: 'Test this API endpoint:' },
  { id: 'note-take', name: 'Take Notes', description: 'Create and manage notes', category: 'Productivity', icon: '📝', prompt: 'Create a note:' },
  { id: 'calendar', name: 'Calendar', description: 'Manage events and schedules', category: 'Productivity', icon: '📅', prompt: 'Add to calendar:' },
  { id: 'image-generate', name: 'Generate Image', description: 'Generate images from text prompts', category: 'Media', icon: '🎨', prompt: 'Generate an image of:' },
];

const CATEGORIES = ['All', 'Dev', 'Data', 'Media', 'Productivity', 'Research'];

export const Skills: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [runningSkill, setRunningSkill] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { status, chatWithHermes } = useHermes();

  // Show notification
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Filter skills based on search and category
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, skills]);

  // Run a skill - sends to Hermes chat
  const handleRunSkill = useCallback(async (skill: Skill) => {
    if (runningSkill) return;
    
    setRunningSkill(skill.id);
    
    try {
      // Use chatWithHermes to send the skill prompt
      const response = await chatWithHermes(`${skill.prompt} (User triggered skill: ${skill.name})`);
      
      if (response.success) {
        showNotification(`Skill "${skill.name}" executed successfully`, 'success');
      } else {
        showNotification(response.message || `Skill "${skill.name}" completed in demo mode`, response.error ? 'error' : 'success');
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message || 'Failed to run skill'}`, 'error');
    } finally {
      setRunningSkill(null);
    }
  }, [runningSkill, chatWithHermes, showNotification]);

  return (
    <div className="skills-container" style={{ padding: '24px' }}>
      {/* Notification */}
      {notification && (
        <div className={`skill-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
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

      {/* Connection status */}
      {status && !status.installed && (
        <div className="skills-status-bar">
          Hermes not detected - Running in demo mode
        </div>
      )}
      {status && status.installed && !status.running && (
        <div className="skills-status-bar warning">
          Hermes installed but not running - Start Hermes for full functionality
        </div>
      )}

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
              onClick={() => handleRunSkill(skill)}
              disabled={runningSkill !== null}
            >
              {runningSkill === skill.id ? 'Running...' : 'Run'}
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
