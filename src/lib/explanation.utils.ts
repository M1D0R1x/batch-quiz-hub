export function getAnswerFeedback(
  correctIndices: number[],
  options: string[]
): string {
  const correctOptionLabels = correctIndices
    .map((idx) => {
      const letter = String.fromCharCode(65 + idx);
      const text = options[idx];
      return text ? `Option ${letter} ("${text}")` : `Option ${letter}`;
    })
    .filter(Boolean);

  if (correctOptionLabels.length > 0) {
    return `The correct choice is ${correctOptionLabels.join(" and ")}.`;
  }
  return "Review the correct option(s) highlighted above to reinforce key concepts.";
}

export function getCleanExplanation(
  explanation: string | undefined | null,
  options: string[],
  correctIndices: number[]
): string {
  const exp = explanation ? explanation.trim() : "";

  let cleaned = exp
    .replace(/^Your answer is <strong>Correct<\/strong>\.<br>(?:<strong>Explanation:<\/strong>)?\s*/i, "")
    .replace(/^Your answer is Correct\.?\s*(?:Explanation:)?\s*/i, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const isGeneric =
    !cleaned ||
    /^correct\.?$/i.test(cleaned) ||
    /^your answer is correct\.?$/i.test(cleaned) ||
    /^correct answer\.?$/i.test(cleaned);

  if (isGeneric) {
    return getAnswerFeedback(correctIndices, options) + " Review this topic's key concepts to reinforce your understanding.";
  }

  return cleaned;
}
