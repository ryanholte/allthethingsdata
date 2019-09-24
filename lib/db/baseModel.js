// const bookshelf = require('./cconnection');
// const Pusher = require('../components/pusher');
//
// function getUserIdFromModel(model, tableName) {
//   let userId = 0;
//
//   if (model.get('created_by')) {
//     return model.get('created_by');
//   }
//
//   switch (tableName) {
//     case 'sessions':
//     case 'categories':
//     case 'roles':
//     case 'shares':
//     case 'subscriptions':
//     case 'urls':
//       userId = model.get('user_id');
//       break;
//     case 'users':
//       userId = model.get('id');
//       break;
//     // add plan pusher event
//   }
//
//
//   return userId;
// }
//
// function callEvent(model, event) {
//   try {
//     const e = require(`../events/${model.tableName}`);
//     e[event](model);
//   } catch (ex) {
//   }
// }

// const goodies = {
//   initialize() {
//     this.on('updated', function (model) {
//       // callEvent(model, 'updated');
//       // model.fetch().then((m) => {
//       //   if (m) {
//       //     Pusher(model, 'update', false, getUserIdFromModel(m, m.tableName));
//       //   }
//       // });
//     });
//
//     this.on('created', function (model) {
//       console.log('created');
//
//       callEvent(model, 'created');
//
//
//       setTimeout(() => {
//         if (model.get('user_id')) {
//           return Pusher(model, 'update', false, getUserIdFromModel(model, model.tableName));
//         }
//       }, 1000);
//     });
//     this.on('destroying', function (model, attrs) {
//       console.log('destroyed');
//
//       return model.fetch().then((model) => {
//
//         callEvent(model, 'destroyed');
//
//         console.log('model', model.get('id'), model);
//         Pusher(model, 'destroyed', model.get('id'), getUserIdFromModel(model, model.tableName));
//       });
//     })
//   }
// },


module.exports = {
  find(id, doFetch = true) {
    let obj = {}

    if (typeof id === 'object') {
      obj = id;
    } else {
      obj.id = id;
    }

    const relations = this.forge().customRelations;
    let fetchOptions = undefined;

    if (relations) {
      fetchOptions = {
        withRelated: relations
      };
    }

    const query = this.forge()
      .query({
        where: obj,
      });

    if (doFetch) {
      return query.fetch(fetchOptions);
    }
    return query;
  },

  findBy() {
    const args = Array.prototype.slice.call(arguments);

    if (args.length > 1) {

      const property = args[0];
      const id = args[1];
      const limit = args[2];
      const obj = {};
      obj[property] = id;
      const obj_where = {
        where: obj,
      };
      const query_obj = obj_where;

      if (limit) {
        query_obj.limit = limit;
      }

      return this.forge()
        .query(query_obj)
        .fetchAll();

    } else {
      return this.forge()
        .query({
          where: args[0]
        })
        .fetchAll();
    }

  },

  findFirstBy(property, id) {
    const args = Array.prototype.slice.call(arguments);

    if (args.length > 1) {
      const obj = {};
      obj[property] = id;

      const query_obj = {
        where: obj
      };
      return this.forge()
        .query(query_obj)
        .fetch();
    }

    // passing an object as the property
    return this.forge()
      .query({ where: property })
      .fetch();
  },

  findWhereIn(property, idArray) {
    return this.forge()
      .query('whereIn', property, idArray)
      .fetchAll();
  },

  create(record) {
    return this.forge(record).save();
  },

  delete(id) {
    return this
      .forge()
      .query(function (qb) {
        qb.where({ id });
        qb.delete(['*']);
      });
  },

  update(id, record) {
    // return this.forge({id: id})
    //   .save(record, {patch: true, require: false});

    return this
      .forge({ id })
      .save(record, { patch: true, require: false })
      .then(() => {
        return this.find(id);
      });
  },
};
