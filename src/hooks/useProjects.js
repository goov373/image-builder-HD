import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Projects Database Hook
 * Handles saving/loading projects from Supabase (or localStorage fallback)
 */
export default function useProjects(initialData = []) {
  const [projects, setProjects] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Load projects from Supabase on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load projects from database
  const loadProjects = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem('carousel-tool-projects');
        if (stored) {
          setProjects(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform database format to app format
      const transformed = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ...row.data, // Spread the JSONB data (carousels, frames, etc.)
      }));

      setProjects(transformed);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err.message);
      
      // Fallback to localStorage on error
      try {
        const stored = localStorage.getItem('carousel-tool-projects');
        if (stored) {
          setProjects(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a project to database
  const saveProject = useCallback(async (project) => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      setProjects(prev => {
        const updated = prev.map(p => p.id === project.id ? project : p);
        if (!prev.find(p => p.id === project.id)) {
          updated.push(project);
        }
        localStorage.setItem('carousel-tool-projects', JSON.stringify(updated));
        return updated;
      });
      return { data: project, error: null };
    }

    setSyncing(true);
    try {
      const { id, name, type, createdAt, updatedAt, ...data } = project;
      
      const { data: result, error } = await supabase
        .from('projects')
        .upsert({
          id,
          name,
          type: type || 'carousel',
          data, // Store everything else in JSONB
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProjects(prev => {
        const updated = prev.map(p => p.id === project.id ? project : p);
        if (!prev.find(p => p.id === project.id)) {
          updated.push(project);
        }
        return updated;
      });

      return { data: result, error: null };
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.message);
      
      // Still update localStorage as backup
      setProjects(prev => {
        const updated = prev.map(p => p.id === project.id ? project : p);
        if (!prev.find(p => p.id === project.id)) {
          updated.push(project);
        }
        localStorage.setItem('carousel-tool-projects', JSON.stringify(updated));
        return updated;
      });
      
      return { data: null, error: err };
    } finally {
      setSyncing(false);
    }
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (projectId) => {
    if (!isSupabaseConfigured()) {
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== projectId);
        localStorage.setItem('carousel-tool-projects', JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    setSyncing(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      return { error: null };
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
      return { error: err };
    } finally {
      setSyncing(false);
    }
  }, []);

  // Duplicate a project
  const duplicateProject = useCallback(async (projectId, newName) => {
    const original = projects.find(p => p.id === projectId);
    if (!original) return { error: { message: 'Project not found' } };

    const duplicate = {
      ...original,
      id: crypto.randomUUID(),
      name: newName || `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return saveProject(duplicate);
  }, [projects, saveProject]);

  return {
    projects,
    loading,
    error,
    syncing,
    loadProjects,
    saveProject,
    deleteProject,
    duplicateProject,
    isCloudEnabled: isSupabaseConfigured(),
  };
}

