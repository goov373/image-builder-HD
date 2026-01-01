import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large dependencies
          'vendor-react': ['react', 'react-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'vendor-export': ['html-to-image', 'html2canvas', 'jszip', 'file-saver'],
          
          // Feature chunks - group related functionality
          'feature-editors': [
            './src/components/EblastEditor.jsx',
            './src/components/SingleImageEditor.jsx',
            './src/components/VideoCoverEditor.jsx',
          ],
          'feature-carousel': [
            './src/components/CarouselFrame.jsx',
            './src/components/CarouselRow.jsx',
            './src/components/MockupFrame.jsx',
          ],
          'feature-layers': [
            './src/components/ImageLayer.jsx',
            './src/components/IconLayer.jsx',
            './src/components/PatternLayer.jsx',
            './src/components/ProductImageLayer.jsx',
          ],
        },
      },
    },
    // Increase warning limit slightly (we're optimizing, not eliminating)
    chunkSizeWarningLimit: 600,
  },
})



