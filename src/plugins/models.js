import { Model } from 'radiks';

class Test extends Model {
  static className = 'Test';

  static schema = {
    title: String
  }

  static defaults = {
    title: 'post title'
  }
}


// export { Test }
