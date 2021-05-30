export const mockRepository = function(Entity){
    this.create = ()=> [new Entity()];
    this.save = (data) => data;
    this.update =  ()=> new Entity();
    this.findOne =  ()=> new Entity();
    this.delete = () => ({affected: 1});
    this.createQueryBuilder = function() {
      this.orderBy= () => (this);
      this.value= new Array(30).fill(new Entity);
      this.andWhere= () => (this);
      this.select= () => (this);
      this.groupBy= () => (this);
      this.leftJoinAndSelect =  ()=> this;
      this.leftJoin = () => this;
      this.getCount= () => (this.value.length);
      this.skip= (index) => this.value.splice(0, index);
      this.take= (index) => this.value = this.value.splice(0, index);
      this.getMany= () => this.value;
      this.getOne = () => this.value[0];
      this.whereNull = () => null;
      this.where = () => this;
      this.getRawMany = () => this.value
      return this;
    };
  }