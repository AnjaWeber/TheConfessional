import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConfessionDto } from 'src/dto/create-confession.dto';
import { Confession } from 'src/schemas/confession.schema';

@Injectable()
export class ConfessionsService {
  constructor(
    @InjectModel(Confession.name) private confessionModel: Model<Confession>,
  ) {}

  async create(createCatDto: CreateConfessionDto): Promise<Confession> {
    const createdCat = new this.confessionModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Confession[]> {
    return this.confessionModel.find().exec();
  }

  async readRandom(): Promise<Confession> {
    const totalCount = await this.confessionModel.count().exec();
    const skipCount = Math.floor(Math.random() * totalCount);
    return this.confessionModel.findOne().skip(skipCount).exec();
  }

  async readAndDeleteRandom(): Promise<Confession> {
    const totalCount = await this.confessionModel.count().exec();
    const skipCount = Math.floor(Math.random() * totalCount);
    const confession = await this.confessionModel
      .findOne()
      .skip(skipCount)
      .exec();
    await this.confessionModel.deleteOne({ _id: confession._id }).exec();
    return confession;
  }
}
