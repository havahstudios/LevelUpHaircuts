// Button label that slides up and is replaced by a copy of itself when the
// parent (with class "group") is hovered. The template's "switch text" effect.
export default function SwitchText({ children }: { children: string }) {
  return (
    <span className="switch-text">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}
