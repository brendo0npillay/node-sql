const Pool = require("pg").Pool;
const {
  addNewVisitor,
  listAllVisitors,
  deleteAVisitor,
  updateAVisitor,
  viewOneVisitor,
  deleteAllVisitors,
  viewLastVisitor,
  createTable,
  errorMsg,
  successMsg,
} = require("../src/index");
const queryObjects = require("../src/query");

describe("visitor database", () => {
  let querySpy;

  beforeEach(() => {
    querySpy = spyOn(Pool.prototype, "query");
  });

  describe("createTable function", () => {
    it("Should successfully create a table", async () => {
      querySpy.and.returnValue(Promise.resolve());

      expect(await createTable()).toBe(successMsg.tableCreation);
    });
  });

  describe("addNewVisitor function", () => {
    let mockVisitor;
    beforeEach(() => {
      mockVisitor = {
        full_name: "John Doe",
        visitor_age: 30,
        date_of_visit: "04/12/2024",
        time_of_visit: "10:30",
        assistant_name: "Jane Smith",
        comments: "Interested in learning about Docker.",
      };
    });
    afterEach(() => {
      mockVisitor = {
        full_name: "John Doe",
        visitor_age: 30,
        date_of_visit: "04/12/2024",
        time_of_visit: "10:30",
        assistant_name: "Jane Smith",
        comments: "Interested in learning about Docker.",
      };
    });
    it("Should throw an error if full name is incorrect", async () => {
      mockVisitor.full_name = "JohnDoe";
      await expectAsync(addNewVisitor(mockVisitor)).toBeRejectedWith(
        new Error(errorMsg.invalidName)
      );
    });

    it("Should throw an error if age is invalid", async () => {
      mockVisitor.visitor_age = "12";
      await expectAsync(addNewVisitor(mockVisitor)).toBeRejectedWith(
        new Error(errorMsg.invalidAge)
      );
    });

    it("Should throw an error if date is invalid", async () => {
      mockVisitor.date_of_visit = "122/12/2001";
      await expectAsync(addNewVisitor(mockVisitor)).toBeRejectedWith(
        new Error(errorMsg.invalidDate)
      );
    });

    it("Should throw an error if time is invalid", async () => {
      mockVisitor.time_of_visit = "1222:12";
      await expectAsync(addNewVisitor(mockVisitor)).toBeRejectedWith(
        new Error(errorMsg.invalidTime)
      );
    });

    it("Should add a new visitor", async () => {
      querySpy.and.returnValue(Promise.resolve({ rows: [{ id: 1 }] }));
      const result = await addNewVisitor(mockVisitor);

      expect(querySpy).toHaveBeenCalledOnceWith(
        jasmine.stringMatching("INSERT INTO visitors"),
        [
          "John Doe",
          30,
          "04/12/2024",
          "10:30",
          "Jane Smith",
          "Interested in learning about Docker.",
        ]
      );

      expect(result).toBe(successMsg.visitorCreation(1));
    });
  });

  describe("listAllVisitors function", () => {
    it("Should list all visitors in the database", async () => {
      querySpy.and.returnValue({ rows: [{ id: 1, full_name: "testUser" }] });

      const result = await listAllVisitors();

      expect(querySpy).toHaveBeenCalledOnceWith(
        jasmine.stringMatching(queryObjects.selectAll)
      );

      expect(result).toEqual([
        {
          id: 1,
          full_name: "testUser",
        },
      ]);
    });
  });

  describe("deleteAVisitor function", () => {
    beforeEach(() => {
      querySpy.and.returnValue(Promise.resolve({ rows: [{ id: 1 }] }));
    });
    it("Should throw an error if the id is not provided", async () => {
      await expectAsync(deleteAVisitor()).toBeRejectedWith(
        new Error(errorMsg.nonexistentId)
      );
    });

    it("Should delete a visitor", async () => {
      const id = 1;

      const result = await deleteAVisitor(id);

      expect(querySpy).toHaveBeenCalledWith(queryObjects.deleteOne, [id]);
      expect(result).toBe(successMsg.visitorDeleted(id));
    });
  });

  describe("updateAVisitor function", () => {
    beforeEach(() => {
      querySpy.and.returnValue(Promise.resolve({ rows: [{ id: 1 }] }));
    });

    it("Should throw an error if name is invalid", async () => {
      await expectAsync(
        updateAVisitor(1, "full_name", "invalid")
      ).toBeRejectedWith(new Error(errorMsg.invalidName));
    });

    it("Should throw an error if age is invalid", async () => {
      await expectAsync(
        updateAVisitor(1, "visitor_age", "21")
      ).toBeRejectedWith(new Error(errorMsg.invalidAge));
    });

    it("Should throw an error if date is invalid", async () => {
      await expectAsync(
        updateAVisitor(1, "date_of_visit", "122/12/2020")
      ).toBeRejectedWith(new Error(errorMsg.invalidDate));
    });

    it("Should throw an error if time is invalid", async () => {
      await expectAsync(
        updateAVisitor(1, "time_of_visit", "1222:12")
      ).toBeRejectedWith(new Error(errorMsg.invalidTime));
    });

    it("Should throw an error if id is not provided", async () => {
      await expectAsync(
        updateAVisitor(null, "full_name", "John Doe")
      ).toBeRejectedWith(new Error(errorMsg.nonexistentId));
    });

    it("Should thrown an error if id does not exist in database", async () => {
      querySpy.and.returnValue(Promise.resolve({ rows: [] }));
      await expectAsync(
        updateAVisitor(20, "full_name", "john doe")
      ).toBeRejectedWith(new Error(errorMsg.nonexistentVisitor));
    });

    it("Should update a visitor", async () => {
      const result = await updateAVisitor(1, "full_name", "updated name");

      expect(querySpy).toHaveBeenCalledWith(
        jasmine.stringMatching(/UPDATE visitors\s+SET full_name = \$1/),
        ["updated name", 1]
      );

      expect(result).toBe(successMsg.visitorUpdated(1));
    });
  });

  describe("viewOneVisitor function", () => {
    it("Should throw an error if id is not provided", async () => {
      await expectAsync(viewOneVisitor()).toBeRejectedWith(
        new Error(errorMsg.nonexistentId)
      );
    });

    it("Should view a visitor", async () => {
      const id = 1;
      const testVisitor = {
        id: 1,
        visitor_name: "test user",
        visitor_age: 30,
        date_of_visit: "2024-12-04",
        time_of_visit: "10:30:00",
        assistant_name: "test assistant",
        comments: "test comment.",
      };

      querySpy.and.returnValue({ rows: [testVisitor] });

      const result = await viewOneVisitor(id);

      expect(querySpy).toHaveBeenCalledOnceWith(queryObjects.viewOne, [id]);
      expect(result).toEqual([testVisitor]);
    });
  });

  describe("deleteAllVisitors function", () => {
    it("Should throw an error if there are no visitors to delete", async () => {
      querySpy.and.returnValue(Promise.resolve({ rows: [] }));
      await expectAsync(deleteAllVisitors()).toBeRejectedWith(
        new Error(errorMsg.noVisitors)
      );
    });

    it("Should delete all visitors", async () => {
      querySpy.and.returnValue(Promise.resolve({ rows: [{ id: 1 }] }));

      const result = await deleteAllVisitors();

      expect(querySpy).toHaveBeenCalledWith("DELETE FROM visitors");
      expect(result).toBe(successMsg.allVisitorsDeleted);
    });
  });

  describe("viewLastVisitor function", () => {
    it("Should view the last visitor", async () => {
      querySpy.and.returnValue({ rows: [{ id: 10 }] });

      const result = await viewLastVisitor();

      expect(querySpy).toHaveBeenCalledOnceWith(queryObjects.viewLast);
      expect(result).toEqual(10);
    });
  });
});
