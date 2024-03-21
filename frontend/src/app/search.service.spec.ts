import { TestBed } from '@angular/core/testing';
import { StockDataService } from './search.service';

describe('SearchService', () => {
  let service: StockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
