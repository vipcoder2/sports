import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Router } from 'express';
import axios from 'axios';
import { Match, Sport, Stream } from '../shared/schema';

const STREAMED_API_BASE = 'https://streamed.pk/api';

const router = Router();
const BASE_URL = 'https://streamed.pk/api';

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy routes to Streamed API

  // Get sports categories
  app.get('/api/sports', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/sports`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching sports:', error);
      res.status(500).json({ error: 'Failed to fetch sports' });
    }
  });

  // Get matches for a specific sport
  app.get('/api/matches/:sport', async (req, res) => {
    try {
      const { sport } = req.params;
      const response = await fetch(`${STREAMED_API_BASE}/matches/${sport}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ error: 'Failed to fetch matches' });
    }
  });

  // Get all matches
  app.get('/api/matches/all', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/matches/all`);
      if (!response.ok) {
        console.error('Streamed API error:', response.status, response.statusText);
        return res.status(response.status).json({ error: 'Failed to fetch all matches from source API' });
      }
      const data = await response.json();
      console.log('All matches fetched successfully:', data?.length || 0, 'matches');
      
      // Ensure all matches have valid IDs
      const validMatches = data.filter((match: any) => match && match.id);
      console.log('Valid matches after filtering:', validMatches.length);
      
      res.json(validMatches);
    } catch (error) {
      console.error('Error fetching all matches:', error);
      res.status(500).json({ error: 'Failed to fetch all matches' });
    }
  });

  // Get all popular matches
  app.get('/api/matches/all/popular', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/matches/all/popular`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching all popular matches:', error);
      res.status(500).json({ error: 'Failed to fetch all popular matches' });
    }
  });

  // Get all today's matches
  app.get('/api/matches/all-today', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/matches/all-today`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching today\'s matches:', error);
      res.status(500).json({ error: 'Failed to fetch today\'s matches' });
    }
  });

  // Get popular today's matches
  app.get('/api/matches/all-today/popular', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/matches/all-today/popular`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching popular today\'s matches:', error);
      res.status(500).json({ error: 'Failed to fetch popular today\'s matches' });
    }
  });

  // Get live matches
  app.get('/api/matches/live', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/matches/live`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      res.status(500).json({ error: 'Failed to fetch live matches' });
    }
  });

  // Get popular live matches
  app.get('/api/matches/live/popular', async (req, res) => {
    try {
      const response = await fetch(`${STREAMED_API_BASE}/matches/live/popular`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching popular live matches:', error);
      res.status(500).json({ error: 'Failed to fetch popular live matches' });
    }
  });

  // Get popular matches for a specific sport
  app.get('/api/matches/:sport/popular', async (req, res) => {
    try {
      const { sport } = req.params;
      const response = await fetch(`${STREAMED_API_BASE}/matches/${sport}/popular`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching popular matches for sport:', error);
      res.status(500).json({ error: 'Failed to fetch popular matches for sport' });
    }
  });

  // Get a specific match by ID
  app.get('/api/match/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching match with ID: ${id}`);
      
      // First try to get all matches and find the specific one
      const response = await fetch(`${STREAMED_API_BASE}/matches/all`);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch matches' });
      }
      
      const matches = await response.json();
      
      // Improved match comparison to handle all ID types
      const searchId = String(id);
      const match = matches.find((m: any) => {
        if (!m || !m.id) return false;
        const matchIdStr = String(m.id);
        
        // Try exact match first (most common case)
        if (matchIdStr === searchId) return true;
        
        // Try URL encoded versions
        try {
          const encodedSearchId = encodeURIComponent(searchId);
          const encodedMatchId = encodeURIComponent(matchIdStr);
          if (encodedMatchId === encodedSearchId || matchIdStr === encodedSearchId || encodedMatchId === searchId) return true;
        } catch (e) {
          // Ignore encode errors
        }
        
        // Try URL decoded versions
        try {
          const decodedSearchId = decodeURIComponent(searchId);
          const decodedMatchId = decodeURIComponent(matchIdStr);
          if (decodedMatchId === decodedSearchId || matchIdStr === decodedSearchId || decodedMatchId === searchId) return true;
        } catch (e) {
          // Ignore decode errors
        }
        
        // Try case-insensitive comparison for string IDs
        if (searchId.toLowerCase() === matchIdStr.toLowerCase()) return true;
        
        return false;
      });
      
      if (!match) {
        console.log(`Match not found with ID: ${id}`);
        console.log('Available match IDs sample:', matches.slice(0, 10).map((m: any) => ({ id: m.id, title: m.title })));
        return res.status(404).json({ error: 'Match not found' });
      }
      
      console.log(`Match found: ${match.title}`);
      res.json(match);
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({ error: 'Failed to fetch match' });
    }
  });

  // Get stream sources for a match
  app.get('/api/stream/:source/:id', async (req, res) => {
    try {
      const { source, id } = req.params;
      console.log(`Fetching streams for source: ${source}, id: ${id}`);
      const response = await fetch(`${STREAMED_API_BASE}/stream/${source}/${id}`);
      
      if (!response.ok) {
        console.error('Streamed API stream error:', response.status, response.statusText);
        return res.status(response.status).json({ error: 'Failed to fetch streams from source API' });
      }
      
      const data = await response.json();
      console.log(`Stream data for ${source}/${id}:`, Array.isArray(data) ? `${data.length} streams` : 'data received');
      res.json(data);
    } catch (error) {
      console.error('Error fetching streams:', error);
      res.status(500).json({ error: 'Failed to fetch streams' });
    }
  });

  // Image endpoints
  router.get('/api/images/badge/:id.webp', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${BASE_URL}/images/badge/${id}.webp`, {
        responseType: 'stream'
      });

      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      response.data.pipe(res);
    } catch (error) {
      res.status(404).send('Image not found');
    }
  });

  router.get('/api/images/poster/:badge1/:badge2.webp', async (req, res) => {
    try {
      const { badge1, badge2 } = req.params;
      const response = await axios.get(`${BASE_URL}/images/poster/${badge1}/${badge2}.webp`, {
        responseType: 'stream'
      });

      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      response.data.pipe(res);
    } catch (error) {
      res.status(404).send('Image not found');
    }
  });

  router.get('/api/images/proxy/:poster.webp', async (req, res) => {
    try {
      const { poster } = req.params;
      const response = await axios.get(`${BASE_URL}/images/proxy/${poster}.webp`, {
        responseType: 'stream'
      });

      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      response.data.pipe(res);
    } catch (error) {
      res.status(404).send('Image not found');
    }
  });

  // App routes
  app.use('/', router);

  const httpServer = createServer(app);

  return httpServer;
}