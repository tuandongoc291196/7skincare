export interface QA {
  answerId: number;
  questionId: number;
}

export interface SkinTestData {
  accountId?: number;
  userTests: QA[];
}
