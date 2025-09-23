import { ReactNode } from 'react';

import styles from './TwoColumnLayout.module.scss';

interface TwoColumnLayoutProps {
  content: ReactNode;
  aside: ReactNode;
  className?: string;
}

export default function TwoColumnLayout({
  content,
  aside,
  className
}: TwoColumnLayoutProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.grid}>
        <div className={styles.content}>
          {content}
        </div>
        <div className={styles.aside}>
          {aside}
        </div>
      </div>
    </div>
  );
}