import { BLOCKS, INLINES } from '@contentful/rich-text-types';

export const richTextOptions = {
  renderNode: {
    // 1. Autoembed Inline Hyperlinks (e.g., automatically embedding YouTube URLs)
    [INLINES.HYPERLINK]: (node, next) => {
      const url = node.data.uri;

      // Check if the link is a YouTube URL
      if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
        const videoId = url.split('v=')[1] || url.split('/').pop();
        return `<div class="video-embed">
                  <iframe width="560" height="315" src="https://youtube.com{videoId}" frameborder="0" allowfullscreen></iframe>
                </div>`;
      }
      
      // Fallback to standard link
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`;
    },

    // 2. Autoembed Assets (Images, Videos uploaded straight to Contentful)
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title } = node.data.target.fields;
      if (file.contentType.startsWith('image/')) {
        return `<img src="${file.url}" alt="${title}" class="embedded-image" />`;
      }
      if (file.contentType.startsWith('video/')) {
        return `<video controls src="${file.url}" class="embedded-video"></video>`;
      }
      return `<a href="${file.url}">Download ${title}</a>`;
    },

    // 3. Autoembed Blocks / Custom Entries (e.g., Code Blocks, Callout Boxes)
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const { sys, fields } = node.data.target;
      
      // Custom Code Block Content Type
      if (sys.contentType.sys.id === 'codeBlock') {
        return `<pre><code class="language-${fields.language}">${fields.code}</code></pre>`;
      }
      
      return `<!-- Unsupported entry type -->`;
    }
  }
};
