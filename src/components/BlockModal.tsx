import React from 'react';
import { BlockData } from '@/types/blockchain';
import { X, ExternalLink, Github, Mail, Linkedin, Globe, Calendar, Hash, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockModalProps {
  block: BlockData;
  onClose: () => void;
}

export const BlockModal: React.FC<BlockModalProps> = ({ block, onClose }) => {
  const getIconForLinkType = (type: string) => {
    switch (type) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'demo': return <ExternalLink className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-primary font-cyber font-bold">
                #{block.blockNumber}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-cyber text-primary neon-glow">
                {block.title}
              </h2>
              <p className="text-muted-foreground">
                {block.subtitle}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/20 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Block Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Timestamp</div>
                <div className="font-mono text-sm">
                  {new Date(block.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Block Hash</div>
                <div className="font-mono text-sm">
                  {block.hash.substring(0, 16)}...
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Nonce</div>
                <div className="font-mono text-sm">
                  {block.nonce.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {block.details.content}
            </div>
          </div>

          {/* Technologies */}
          {block.details.technologies && (
            <div>
              <h3 className="text-lg font-cyber text-primary mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {block.details.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {block.details.achievements && (
            <div>
              <h3 className="text-lg font-cyber text-primary mb-3">Key Achievements</h3>
              <ul className="space-y-2">
                {block.details.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span className="text-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Snippet */}
          {block.details.codeSnippet && (
            <div>
              <h3 className="text-lg font-cyber text-primary mb-3">Code Sample</h3>
              <pre className="bg-muted/20 border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {block.details.codeSnippet}
                </code>
              </pre>
            </div>
          )}

          {/* Links */}
          {block.details.links && block.details.links.length > 0 && (
            <div>
              <h3 className="text-lg font-cyber text-primary mb-3">Links</h3>
              <div className="flex flex-wrap gap-3">
                {block.details.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-button flex items-center space-x-2 text-sm"
                  >
                    {getIconForLinkType(link.type)}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};