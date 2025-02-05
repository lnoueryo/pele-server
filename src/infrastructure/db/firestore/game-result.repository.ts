import admin from 'firebase-admin'
import { IGameResultRepository } from 'src/domain/repositories/db/game-result.repository.interface'
import { GameResult } from 'src/domain/entities/game-result.entity'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GameResultRepository implements IGameResultRepository {
  constructor(
    @Inject('FIRESTORE') private readonly fireStore: admin.firestore.Firestore,
  ) {}
  async findAll(): Promise<GameResult[]> {
    const gamesRef = this.fireStore.collection('game-results')
    const snapshot = await gamesRef.get()
    return snapshot.docs.map((doc) => {
      const {
        gameId,
        userId,
        name,
        startTimestamp,
        lastTimestamp,
        createdAt,
        updatedAt,
      } = doc.data()
      return new GameResult({
        id: doc.id,
        userId,
        name,
        gameId,
        startTimestamp,
        lastTimestamp,
        createdAt: createdAt.toDate(),
        updatedAt: updatedAt.toDate(),
      })
    })
  }
  async findByUserId(id: string): Promise<GameResult[]> {
    const gamesRef = this.fireStore.collection('game-results')
    const snapshot = await gamesRef.where('userId', '==', id).get()
    return snapshot.docs.map((doc) => {
      const {
        gameId,
        userId,
        name,
        startTimestamp,
        lastTimestamp,
        createdAt,
        updatedAt,
      } = doc.data()
      return new GameResult({
        id: doc.id,
        gameId,
        userId,
        name,
        startTimestamp,
        lastTimestamp,
        createdAt: createdAt.toDate(),
        updatedAt: updatedAt.toDate(),
      })
    })
  }
  async save(gameResult: GameResult): Promise<GameResult> {
    const {
      gameId,
      userId,
      name,
      startTimestamp,
      lastTimestamp,
      createdAt,
      updatedAt,
    } = gameResult
    const newGameResult = await this.fireStore.collection('game-results').add({
      gameId,
      userId,
      name,
      startTimestamp,
      lastTimestamp,
      createdAt,
      updatedAt,
    })
    gameResult.id = newGameResult.id
    return gameResult
  }
}
