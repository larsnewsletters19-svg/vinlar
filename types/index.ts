export interface AromaScores {
  [key: string]: number;
}

export interface RegionStyle {
  name: string;
  description: string;
}

export interface Structure {
  acidity: number;
  body: number;
  alcohol: number;
  tannin: number;
  sweetness: number;
  oak: number;
}

export interface Grape {
  id: string;
  name: string;
  aliases?: string[];
  type: 'white' | 'red' | 'sparkling' | 'sweet' | 'rosé';
  shortDescription: string;
  typicalAromas: string[];
  aromaScores: AromaScores;
  structure: Structure;
  commonRegionsAndStyles: RegionStyle[];
  blindTastingClues: string[];
  commonConfusions: string[];
}

export interface Aroma {
  id: string;
  name: string;
  family: string;
  category: string;
  emoji: string;
  description: string;
}

export interface GrapeVsGrapeComparison {
  id: string;
  type: 'grape_vs_grape';
  title: string;
  grapeA: string;
  grapeB: string;
  inCommon: string[];
  grapeAStandsOut: string[];
  grapeBStandsOut: string[];
  blindTastingTip: string;
}

export interface StyleVsStyleComparison {
  id: string;
  type: 'style_vs_style';
  title: string;
  grape: string;
  styleA: { name: string; region: string };
  styleB: { name: string; region: string };
  styleACharacter: string[];
  styleBCharacter: string[];
  blindTastingTip: string;
}

export type Comparison = GrapeVsGrapeComparison | StyleVsStyleComparison;

export interface TrainingQuestion {
  id: string;
  type: 'guess_grape' | 'guess_style' | 'distinguish' | 'match_aroma';
  category: 'white' | 'red' | 'rosé' | 'sparkling' | 'sweet' | 'style' | 'winemaking' | 'technique' | 'glossary';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LearnItem {
  id: string;
  section: 'mouth' | 'winemaking' | 'technique';
  name: string;
  icon: string;
  shortDescription: string;
  whatItIs: string;
  howItFeels: string;
  tryItYourself: string;
  highExamples: string[];
  lowExamples: string[];
  commonMisconceptions: string;
}