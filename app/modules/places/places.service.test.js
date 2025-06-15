import placesService from './places.service';
import { fn } from 'jest-mock';

const mockPlaceSchema = {
  find: fn(),
  findById: fn(),
  findByIdAndUpdate: fn().mockResolvedValue({}),
  findByIdAndDelete: fn().mockResolvedValue({}),
  save: fn(),
};

const mockRes = () => {
  const res = {};
  res.status = fn().mockReturnValue(res);
  res.json = fn().mockReturnValue(res);
  res.send = fn().mockReturnValue(res);
  return res;
};

describe('placesService', () => {
  let service;
  let req;
  let res;

  beforeEach(() => {
    mockPlaceSchema.find.mockClear();
    mockPlaceSchema.findById.mockClear();
    mockPlaceSchema.findByIdAndUpdate.mockClear();
    mockPlaceSchema.findByIdAndDelete.mockClear();
    mockPlaceSchema.save.mockClear();
    service = placesService({ repository: mockPlaceSchema });
    req = { body: {}, params: {} };
    res = mockRes();
  });

  describe('index', () => {
    it('should return all places', async () => {
      const places = [{ name: 'A' }, { name: 'B' }];
      mockPlaceSchema.find.mockResolvedValue(places);
      await service.index(req, res);
      expect(mockPlaceSchema.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(places);
    });
  });

  describe('show', () => {
    it('should return a place if found', async () => {
      const place = { name: 'A' };
      req.params.id = '123';
      mockPlaceSchema.findById.mockResolvedValue(place);
      await service.show(req, res);
      expect(mockPlaceSchema.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(place);
    });
    it('should return 404 if place not found', async () => {
      req.params.id = '123';
      mockPlaceSchema.findById.mockResolvedValue(null);
      await service.show(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Place not found' });
    });
  });

  describe('store', () => {
    it('should create a new place', async () => {
      req.body = { name: 'A', address: 'Addr' };
      const saveMock = fn();
      function Place(data) {
        return { ...data, save: saveMock };
      }
      Place.find = mockPlaceSchema.find;
      Place.findById = mockPlaceSchema.findById;
      Place.findByIdAndUpdate = mockPlaceSchema.findByIdAndUpdate;
      Place.findByIdAndDelete = mockPlaceSchema.findByIdAndDelete;
      service = placesService({ repository: Place });
      await service.store(req, res);
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'A', address: 'Addr' }));
    });
  });

  describe('update', () => {
    it('should update place fields and return 204', async () => {
      req.body = { name: 'B', address: 'Addr2' };
      req.params.id = '123';
      await service.update(req, res);
      expect(mockPlaceSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'B', address: 'Addr2' },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should delete place and return 204', async () => {
      req.params.id = '123';
      await service.destroy(req, res);
      expect(mockPlaceSchema.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
