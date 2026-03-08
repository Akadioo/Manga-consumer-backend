import { Test, TestingModule } from '@nestjs/testing';
import { TomeController } from './tome.controller';
import { TomeService } from './tome.service';

describe('TomeController', () => {
  let controller: TomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TomeController],
      providers: [TomeService],
    }).compile();

    controller = module.get<TomeController>(TomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
