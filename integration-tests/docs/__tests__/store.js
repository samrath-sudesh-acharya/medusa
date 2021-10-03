const fixtureWriter = require("../utils/write-fixture").default
const { useApi } = require("../../helpers/use-api")
const { useDb } = require("../../helpers/use-db")

const cartTest = require("../test-input/store/cart")
const customerTest = require("../test-input/store/customer")

const toTest = [cartTest, customerTest]

jest.setTimeout(30000)

test.each(toTest)(
  "$operationId",
  async ({ setup, buildEndpoint, snapshotMatch, operationId }) => {
    const api = useApi()
    const db = useDb()

    const manager = db.connection.manager
    const idOrConfig = await setup(manager, api)

    let config = idOrConfig
    if (typeof idOrConfig === "string") {
      config = {
        id: idOrConfig,
      }
    }

    const response = await api
      .get(buildEndpoint(config.id), {
        headers: config.headers,
      })
      .catch(err => {
        console.log(err)
      })

    expect(response.data).toMatchSnapshot(snapshotMatch)

    fixtureWriter.addFixture(`store.${operationId}`, response.data)
  }
)
