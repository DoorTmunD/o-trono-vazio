'use client';

import { useEffect, useRef } from 'react';
import { createThroneRenderer } from './throne-renderer';
import styles from './throne-scene.module.css';

/** A self-contained, procedural scene: no model, texture or video downloads. */
export default function ThroneScene({ paused = false, exiting = false }) {
  const canvas = useRef(null);
  const renderer = useRef(null);
  const state = useRef({ paused, exiting });

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    function initialize() {
      renderer.current?.dispose();
      renderer.current = createThroneRenderer(element);
      renderer.current?.setPaused(state.current.paused || state.current.exiting);
    }
    function lost(event) {
      event.preventDefault();
      renderer.current?.dispose();
      renderer.current = null;
    }
    initialize();
    element.addEventListener('webglcontextlost', lost);
    element.addEventListener('webglcontextrestored', initialize);
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
      element.removeEventListener('webglcontextlost', lost);
      element.removeEventListener('webglcontextrestored', initialize);
    };
  }, []);

  useEffect(() => {
    state.current = { paused, exiting };
    renderer.current?.setPaused(paused || exiting);
  }, [paused, exiting]);

  return <canvas ref={canvas} className={styles.canvas} data-testid="throne-canvas" aria-hidden="true" />;
}
