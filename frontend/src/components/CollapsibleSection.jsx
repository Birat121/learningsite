import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer font-semibold text-blue-700 flex justify-between items-center"
      >
        <span>{title}</span>
        <span>{open ? '▲' : '▼'}</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;
