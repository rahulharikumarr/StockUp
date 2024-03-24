import { TestBed } from '@angular/core/testing';

import { SearchResultService } from './search-results.service';

describe('SearchResultsService', () => {
  let service: SearchResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
