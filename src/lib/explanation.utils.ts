export function getCleanExplanation(
  explanation: string | undefined | null,
  options: string[],
  correctIndices: number[]
): string {
  const exp = explanation ? explanation.trim() : "";
  
  const isGeneric =
    !exp ||
    /^correct\.?$/i.test(exp) ||
    /^your answer is correct\.?$/i.test(exp) ||
    /^correct answer\.?$/i.test(exp);

  const correctOptionLabels = correctIndices
    .map((idx) => {
      const letter = String.fromCharCode(65 + idx);
      const text = options[idx];
      return text ? `Option ${letter} ("${text}")` : `Option ${letter}`;
    })
    .filter(Boolean);

  if (isGeneric) {
    if (correctOptionLabels.length > 0) {
      return `The correct choice is ${correctOptionLabels.join(
        " and "
      )}. Review this topic's key concepts to reinforce your understanding.`;
    }
    return "Review the correct option(s) highlighted above to reinforce key concepts.";
  }

  let cleaned = exp
    .replace(/^Your answer is <strong>Correct<\/strong>\.<br>(?:<strong>Explanation:<\/strong>)?\s*/i, "")
    .replace(/^Your answer is Correct\.?\s*(?:Explanation:)?\s*/i, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /^correct\.?$/i.test(cleaned)) {
    if (correctOptionLabels.length > 0) {
      return `The correct choice is ${correctOptionLabels.join(
        " and "
      )}. Review this topic's key concepts to reinforce your understanding.`;
    }
    return "Review the correct option(s) highlighted above to reinforce key concepts.";
  }

  return cleaned;
}
