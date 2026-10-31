import TextType from "../animations/text-type";

export function SectionSubheading({
  children,
  typingSpeed,
  text,
}: {
  children?: React.ReactNode;
  typingSpeed?: number;
  text?: string;
}) {
  const content =
    text ?? (typeof children === "string" ? children : "");
  typingSpeed ??= content ? 1000 / content.length : 100;
  return (
    <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-4 font-medium">
      <TextType
        as="span"
        text={`{ ${content} }`}
        typingSpeed={typingSpeed}
        loop={false}
        cursorCharacter="_"
        startOnVisible
      />
    </p>
  );
}
