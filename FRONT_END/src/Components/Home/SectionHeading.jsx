import styles from "./SectionHeading.module.css";

export default function SectionHeading({ title }) {
  return <h3 className={styles.heading}>{title}</h3>;
}
