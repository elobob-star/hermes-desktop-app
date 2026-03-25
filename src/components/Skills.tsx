import React, { useState, useMemo, useEffect } from 'react';
import { useHermes } from '../hooks/useHermes';
import './Skills.css';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  command?: string;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: 'web-search', name: 'Web Search', description: 'Search the web for information', category: 'Research', icon: '🌐', command: 'web search' },
  { id: 'image-generate', name: 'Generate Image', description: 'Generate images from text prompts', category: 'Media', icon: '🎨', command: 'image generate' },
  { id: 'terminal-exec', name: 'Terminal Execution', description: 'Execute terminal commands safely', category: 'Dev', icon: '💻', command: 'terminal' },
  { id: 'code-review', name: 'Code Review', description: 'Review code for issues and improvements', category: 'Dev', icon: '🔍', command: 'code review' },
  { id: 'file-search', name: 'Search Files', description: 'Search for files and content', category: 'Productivity', icon: '📁', command: 'search files' },
  { id: 'email-send', name: 'Send Email', description: 'Send emails via configured SMTP', category: 'Productivity', icon: '📧', command: 'email send' },
  { id: 'data-analyze', name: 'Analyze Data', description: 'Analyze and visualize data sets', category: 'Data', icon: '📊', command: 'data analyze' },
  { id: 'api-test', name: 'Test API', description: 'Test and debug API endpoints', category: 'Dev', icon: '🔌', command: 'api test' },
  { id: 'note-take', name: 'Take Notes', description: 'Create and manage notes', category: 'Productivity', icon: '📝', command: 'note' },
  { id: 'calendar', name: 'Calendar', description: 'Manage events and schedules', category: 'Productivity', icon: '📅', command: 'calendar' },
];

const CATEGORIES = ['All', 'Dev', 'Data', 'Media', 'Productivity', 'Research'];

export const Skills: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [runningSkill, setRunningSkill] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { status, executeCommand } = useHermes();

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter skills based on search and category
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, skills]);

  // Run a skill
  const handleRunSkill = async (skill: Skill) => {
    if (runningSkill) return; // Prevent running multiple skills at once
    
    setRunningSkill(skill.id);
    
    try {
      if (status?.installed && status.paths.executable) {
        // Execute skill via Hermes
        const command = skill.command || skill.id;
        const result = await executeCommand(command);
        showNotification(`Skill "${skill.name}" executed successfully`, 'success');
        console.log(`Skill ${skill.id} result:`, result);
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 500));
        showNotification(`Skill "${skill.name}" would run in connected mode`, 'success');
        console.log(`Demo: Running skill ${skill.id}`);
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message || 'Failed to run skill'}`, 'error');
      console.error(`Skill ${skill.id} error:`, error);
    } finally {
      setRunningSkill(null);
    }
  };

  return (
    <div className="skills-container">
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
