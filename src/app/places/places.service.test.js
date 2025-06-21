import placesService from './places.service';
import { fn } from 'jest-mock';

const mockPlaceSchema = {
  find: fn(),
  findById: fn(),
  findByIdAndUpdate: fn().mockResolvedValue({}),
  findByIdAndDelete: fn().mockResolvedValue({}),
  save: fn(),
};

describe('placesService', () => {
  let service;
  beforeEach(() => {
    mockPlaceSchema.find.mockClear();
    mockPlaceSchema.findById.mockClear();
    mockPlaceSchema.findByIdAndUpdate.mockClear();
    mockPlaceSchema.findByIdAndDelete.mockClear();
    mockPlaceSchema.save.mockClear();
    service = placesService({ repository: mockPlaceSchema });
  });

  describe('index', () => {
    it('should return all places', async () => {
      const places = [{ name: 'A' }, { name: 'B' }];
      mockPlaceSchema.find.mockResolvedValue(places);
      const result = await service.index();
      expect(mockPlaceSchema.find).toHaveBeenCalled();
      expect(result).toEqual(places);
    });
  });

  describe('show', () => {
    it('should return a place if found', async () => {
      const place = { name: 'A' };
      mockPlaceSchema.findById.mockResolvedValue(place);
      const result = await service.show('123');
      expect(mockPlaceSchema.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(place);
    });
    it('should return null if place not found', async () => {
      mockPlaceSchema.findById.mockResolvedValue(null);
      const result = await service.show('123');
      expect(result).toBeNull();
    });
  });

  describe('store', () => {
    it('should create a new place', async () => {
      const saveMock = fn();
      function Place(data) {
        return { ...data, save: saveMock };
      }
      const repo = Object.assign(Place, mockPlaceSchema);
      service = placesService({ repository: repo });
      const result = await service.store({ name: 'A', address: 'Addr' });
      expect(saveMock).toHaveBeenCalled();
      expect(result.status).toBe(201);
      expect(result.body).toEqual(expect.objectContaining({ name: 'A', address: 'Addr' }));
    });
  });

  describe('update', () => {
    it('should update place fields and return 204', async () => {
      const result = await service.update('123', { name: 'B', address: 'Addr2' });
      expect(mockPlaceSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'B', address: 'Addr2' },
        { new: true, runValidators: true }
      );
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
    it('should handle error if update fails', async () => {
      mockPlaceSchema.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));
      await expect(service.update('123', { name: 'B', address: 'Addr2' })).rejects.toThrow('Update failed');
    });
  });

  describe('destroy', () => {
    it('should delete place and return 204', async () => {
      const result = await service.destroy('123');
      expect(mockPlaceSchema.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
    it('should handle error if destroy fails', async () => {
      mockPlaceSchema.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));
      await expect(service.destroy('123')).rejects.toThrow('Delete failed');
    });
  });
});
