// import * as util from "./utilities";

// const fs = require("fs");
const path = require("path");
// const lineReader = require("line-reader");
const debug = require("debug")("testapp2:db");
const LineByLineReader = require("line-by-line");

const hash = require("../models/export2018");
const { util } = require("./utilities");

const Firestore = require("@google-cloud/firestore");
// home/jon/nodeprojects/fileupload/k9space-875d4eb07045.json
const firestore = new Firestore({
  // projectId: "k9space-81902",
  // keyFilename: path.join(global.dir, "test.json")
});

// path.join(global.dir, "test.json")
const fs = require("fs");

const { each, eachSeries } = require("async");

class Post {
  // title: string;
  // content: string;
  constructor() {
    this.title = "";
    this.content = "";
  }

  set title(arg) {
    this.title = arg;
  }
  get title() {
    return this.title;
  }

  set content(arg) {
    this.content = arg;
  }
  get content() {
    return this.content;
  }
}

class PostId extends Post {
  // id: String;
  constructor() {
    super();
    this.id = "";
  }
  set id(arg) {
    this.id = arg;
  }
  get id() {
    return this.id;
  }
}

let lr;

let firstrow = 0;

let batchnum = 0;

// let fileArr = [];
let logname = "";

const openFiles = [];

const getHash = (line) =>
  new Promise(function(resolve, reject) {
    const lineArr = util.parseme(line);

    hash.batchid = util.parsenum(batchnum);

    // distance >
    hash.distance = util.parseflo(lineArr[0]);

    // MLS >
    hash.mls = util.cleanup(lineArr[2]);

    // Closing Date
    hash.closingDate =
      util.cleanup(lineArr[3]) === "" ? null : new Date(lineArr[3]);

    // status >
    hash.status = util.cleanup(lineArr[4]).toLowerCase();

    // sale price > extract numbers and cast
    hash.salePrice = util.parseflo(lineArr[5]);

    // Address >
    hash.address = util.cleanup(lineArr[6]).toLowerCase();

    // DOM
    hash.dom = util.parsenum(lineArr[7]);

    // Pending Date >
    hash.pendingDate =
      util.cleanup(lineArr[8]) === "" ? null : new Date(lineArr[8]);

    // Seller Contributions / Concessions
    hash.contributions = util.parsenum(lineArr[9]);

    // Bedrooms
    hash.beds = util.parsenum(lineArr[10]);

    // Full Baths
    hash.fbaths = util.parsenum(lineArr[11]);

    // Half Baths
    hash.hbaths = util.parsenum(lineArr[12]);

    // Property Type
    hash.propertyType = util.cleanup(lineArr[14]).toLowerCase();

    // Price per sqft (sale price)
    hash.spSQFT = util.parseflo(lineArr[15]);

    // LOT Size SQFT
    hash.gla = util.parsenum(lineArr[16]);

    // SubDivision / Neighborhood
    hash.neighborhood = util.cleanup(lineArr[17]).toLowerCase();

    // Garage Spaces
    hash.garage = util.parsenum(lineArr[18]);

    // Year Built
    hash.yearBuilt = util.cleanup(lineArr[19]);

    // Folio
    hash.folio = util.cleanup(lineArr[20]);

    // Pool 1 = Yes, 0 = No
    hash.pool = util.cleanup(lineArr[21]).toLowerCase() === "yes" ? 1 : 0;

    // LOT SQFT (SITE)
    hash.site = util.parsenum(lineArr[22]);

    // Waterfront Property; 1 = Yes, 0 = No
    hash.waterFront =
      util.cleanup(lineArr[23]).toLowerCase() === "yes" ? 1 : 0;

    // List Date
    hash.listDate =
      util.cleanup(lineArr[24]) === "" ? null : new Date(lineArr[24]);

    // Design
    hash.design = util.cleanup(lineArr[27]).toLowerCase();

    // Type of Association
    hash.TOA = util.cleanup(lineArr[28]).toLowerCase();

    // View
    hash.view = util.cleanup(lineArr[34]).toLowerCase();

    // REO
    hash.reo = util.cleanup(lineArr[35]).toLowerCase() === "yes" ? 1 : 0;

    //
    // hash.id = firstrow;

    resolve(hash);
  });

/*
function log(str) {
  if (!logname.length) {
    // create new file
    const now = new Date();
    logname =
      now.getMonth() +
      1 +
      now.getDate() +
      now.getFullYear() +
      " " +
      now
        .toTimeString()
        .split(" ")
        .shift() +
      ".txt";
  }

  fs.appendFile(
    path.join(global.dir, "logs", logname),
    str + "\n",
    (err) => {
      if (err) throw err;
    }
  );
}
*/

function getLogName() {
  const now = new Date();
  logname =
    now.getMonth() +
    1 +
    "" +
    now.getDate() +
    "" +
    now.getFullYear() +
    " " +
    now
      .toTimeString()
      .split(" ")
      .shift() +
    ".txt";
  return logname;
}

// using line-by-line
function process2(filename, batchid) {
  debug(`begin processing ${filename} ..`);
  // log(`begin processing ${filename} ..`);

  batchnum = batchid;

  firstrow = 0;

  lr = new LineByLineReader(path.join(global.dir, "uploads", filename));

  lr.on("error", function(err) {
    // 'err' contains error object
    console.log(err);
  });

  lr.on("line", function(line) {
    firstrow++;

    if (firstrow <= 1) return false;

    // debugger;
    openFiles.push(line);

    /* 
    getHash(line).then(function(resp) {
      // const hashObj = resp;

      // firestore.getCollections().then((collections) => {
      //   debugger;
      //   for (const collection of collections) {
      //     console.log(`Found collection with id: ${collection.id}`);
      //   }
      // });
      // debugger;
      // let cnt = 0;

      // openFiles.push(resp);

      // const collectionRef = firestore.collection("mls");
      // collectionRef.add(resp).then((doc) => {
      //   debug(`added document with id: ${doc.id}`);

      //   doc.get().then((ds) => {
      //     console.log(firstrow);
      //     debugger;
      //     log(JSON.stringify(ds.data()));
      //   });
      // });

      // const doc = ref.doc();
      // doc.get().then((ds) => {
      //   debugger;
      // });

      // ref
      //   .where("content", "==", "running")
      //   .get()
      //   .then((qs) => {
      //     debugger;
      //   });

      // let docref = firestore.doc("posts/xsTSGF35FcZb4NUQ194j");
      // docref.get().then((ds) => {
      //   let exists = ds.exists;
      //   debugger;
      // });

      // debugger;
    }); 
    */

    return true;
  });

  lr.on("end", function() {
    // const collectionRef = firestore.collection("mls");
    // collectionRef.add(resp).then((doc) => {
    //   debug(`added document with id: ${doc.id}`);

    //   doc.get().then((ds) => {
    //     console.log(firstrow);
    //     debugger;
    //     log(JSON.stringify(ds.data()));
    //   });
    // });
    debugger;
    const collectionRef = firestore.collection("mls");
    const propertyArr = [];

    eachSeries(
      openFiles,
      function(line, callback) {
        getHash(line).then(function(resp) {
          propertyArr.push(resp.address);
          collectionRef.add(resp).then((doc) => {
            // propertyArr.push(doc.id);
            callback();
            // doc.get().then((ds) => {
            //   // propertyArr.push(ds.data().address);
            //   debugger;
            //   debug(ds.data().address);
            //   callback();
            // });
          });
        });

        // callback();
      },
      function(err) {
        if (err) {
          throw new Error(err);
        }

        // ADD TO LOG FILE

        const file = getLogName();
        const wStream = fs.createWriteStream(
          path.join(global.dir, "logs", file),
          { autoClose: true }
        );

        wStream.write(`Processing: ${filename} \n`);
        wStream.write(`Batch Number: ${batchid}\n\n`);

        for (const val of propertyArr) {
          wStream.write("added: " + val + "\n");
        }

        const noww = new Date();
        wStream.write(
          `\nFinished processing ${
            propertyArr.length
          } items @ ${noww.toDateString() + " : " + noww.toTimeString()}`
        );

        wStream.on("finish", () => {
          debug(`finished creating log file '${file}'`);
        });

        wStream.close();
      }
    );
  });
}

module.exports = {
  process,
  process2
};
