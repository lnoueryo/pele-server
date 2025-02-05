import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { AuthUser } from '../shared/auth-user.decorator'
import { GetGameResultResponse } from 'src/interfaces/dto/game-result/get-game-result.response'
import { AuthUserRequest } from 'src/interfaces/dto/auth/auth-user.request'
import { GetGameUserResultUseCase } from 'src/application/usecases/game-result/get-game-user-result.usecase'
import { GetGameResultUseCase } from 'src/application/usecases/game-result/get-game-result.usecase'

@ApiTags('game-results')
@Controller({
  path: 'game-results',
})
export class GameResultController {
  constructor(
    private readonly getGameResultUseCase: GetGameResultUseCase,
    private readonly getGameUserResultUseCase: GetGameUserResultUseCase,
  ) {}
  @Get()
  @ApiResponse({ status: 200, type: GetGameResultResponse })
  async getGameResults(
    @AuthUser() _: AuthUserRequest,
  ): Promise<GetGameResultResponse> {
    const result = await this.getGameResultUseCase.do()
    return new GetGameResultResponse({ gameResults: result })
  }
  @Get('/user')
  @ApiResponse({ status: 200, type: GetGameResultResponse })
  async getGameUserResults(
    @AuthUser() user: AuthUserRequest,
  ): Promise<GetGameResultResponse> {
    const result = await this.getGameUserResultUseCase.do(user.id)
    return new GetGameResultResponse({ gameResults: result })
  }
}
