import React from 'react';
import styles from './List.module.css';

// Defining the prop interface for type safety
interface ListProps {
    title: string;
    children?: React.ReactNode;
}

/**
 * A component that displays a title and a grid of children elements.
 * The grid is responsive: 2 columns on mobile, 4 on desktop.
 * @param {ListProps} props - The component props.
 * @param {string} props.title - The title to display for the list.
 * @param {React.ReactNode} props.children - The child components to render in the grid.
 */
const List = ({ title, children }: ListProps) => {
    return (
        <>
            <section className={styles.listContainer}>
                <header className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.line}></div>
                </header>
                <main className={styles.gridContainer}>
                    {children}
                </main>
            </section>
        </>
    );
};

export default List;
