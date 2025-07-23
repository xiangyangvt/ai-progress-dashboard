import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function AIProgressDashboard() {
  const [query, setQuery] = useState('');
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchRSSFeeds = async () => {
      const endpoints = [
        'https://openai.com/blog/rss.xml',
        'https://www.anthropic.com/news/rss.xml',
        'https://simonwillison.net/atom/everything/',
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCX6b17PVsYBQ0ip5gyeme-Q',
        'https://arxiv.org/rss/cs.AI'
      ];

      const parser = new DOMParser();
      const allItems = [];

      for (const url of endpoints) {
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
          const data = await response.json();
          const xml = parser.parseFromString(data.contents, 'application/xml');
          const items = Array.from(xml.querySelectorAll('item')).slice(0, 3).map(item => ({
            title: item.querySelector('title')?.textContent || 'Untitled',
            url: item.querySelector('link')?.textContent || '#',
            summary: item.querySelector('description')?.textContent || '',
            date: item.querySelector('pubDate')?.textContent || 'Unknown date',
            source: new URL(url).hostname,
          }));
          allItems.push(...items);
        } catch (error) {
          console.error(`Failed to fetch from ${url}:`, error);
        }
      }

      setUpdates(allItems);
    };

    fetchRSSFeeds();
  }, []);

  const filteredUpdates = updates.filter(u =>
    u.title.toLowerCase().includes(query.toLowerCase()) ||
    u.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Progress Dashboard</h1>
      <Input
        placeholder="Search updates..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6"
      />
      <div className="space-y-4">
        {filteredUpdates.map((update, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{update.title}</h2>
              <p className="text-sm text-gray-500">{update.date} — {update.source}</p>
              <p className="mt-2" dangerouslySetInnerHTML={{ __html: update.summary }} />
              <a href={update.url} target="_blank" rel="noopener noreferrer">
                <Button className="mt-3">Read More</Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
