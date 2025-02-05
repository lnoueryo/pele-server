import admin from 'firebase-admin'
import { IGameResultRepository } from 'src/domain/repositories/db/game-result.repository.interface'
import { GameResult } from 'src/domain/entities/game-result.entity'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GameResultRepository implements IGameResultRepository {
  constructor(
    @Inject('FIRESTORE') private readonly fireStore: admin.firestore.Firestore
  ) {}
  async getByUserId(id: string): Promise<GameResult[]> {
    const gamesRef = this.fireStore.collection('game-results').orderBy('order')
    const snapshot = await gamesRef.where('userId', '==', id).get()
    return snapshot.docs.map((doc) => {
      const { gameId, userId, startTimestamp, lastTimestamp, createdAt, updatedAt } =
        doc.data()
      return new GameResult({
        id: doc.id,
        userId,
        gameId,
        startTimestamp,
        lastTimestamp,
        createdAt,
        updatedAt,
      })
    })
  }
  async save(gameResult: GameResult): Promise<GameResult> {
    const { gameId, userId, startTimestamp, lastTimestamp, createdAt, updatedAt } = gameResult
    const newGameResult = await this.fireStore.collection('game-results').add({
      userId,
      gameId,
      startTimestamp,
      lastTimestamp,
      createdAt,
      updatedAt,
    })
    gameResult.id = newGameResult.id
    return gameResult
  }
}
