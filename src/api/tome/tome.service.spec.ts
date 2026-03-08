import { Test, TestingModule } from '@nestjs/testing';
import { TomeService } from './tome.service';

describe('TomeService', () => {
  let service: TomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TomeService],
    }).compile();

    service = module.get<TomeService>(TomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
