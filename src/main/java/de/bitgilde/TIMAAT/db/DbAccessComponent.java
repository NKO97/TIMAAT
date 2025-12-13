package de.bitgilde.TIMAAT.db;

import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

/**
 * Components which require database connectivity can extend to this class.
 * It offers convenience functionalities to easily create database transactions
 * performing a rollback on error.
 *
 * @author Nico Kotlenga
 * @since 20.07.25
 */
public abstract class DbAccessComponent {

    private static final Logger logger = Logger.getLogger(DbAccessComponent.class.getName());

    protected final EntityManagerFactory emf;

    public DbAccessComponent(EntityManagerFactory emf) {
        this.emf = emf;
    }

    protected <RESULT_TYPE> RESULT_TYPE executeDbTransaction(DbTransactionOperation<RESULT_TYPE> dbTransactionOperation) throws DbTransactionExecutionException {
        logger.log(Level.FINE, "Start execution of db transaction");
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            RESULT_TYPE result = dbTransactionOperation.execute(em);
            em.getTransaction().commit();

            return result;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error in execution of db transaction", e);
            em.getTransaction().rollback();
            throw new DbTransactionExecutionException(e);
        } finally {
            em.close();
        }
    }

  /**
   * Exceutes a {@link DbTransactionOperation} having a stream as result
   * Always use this when working with {@link Stream}s. Otherwise the db transaction is already closed
   * and results can't be gathered.
   *
   * @param dbTransactionOperation
   * @return
   * @param <RESULT_TYPE>
   * @throws DbTransactionExecutionException
   */
    protected <RESULT_TYPE> Stream<RESULT_TYPE> executeStreamDbTransaction(DbTransactionOperation<Stream<RESULT_TYPE>> dbTransactionOperation) throws DbTransactionExecutionException {
      logger.log(Level.FINE, "Start execution of db transaction");
      EntityManager em = emf.createEntityManager();
      try {
        em.getTransaction().begin();
        Stream<RESULT_TYPE> result = dbTransactionOperation.execute(em);

        return result.onClose(em::close);
      } catch (Exception e) {
        logger.log(Level.SEVERE, "Error in execution of db transaction", e);
        em.getTransaction().rollback();
        throw new DbTransactionExecutionException(e);
      }
    }

    @FunctionalInterface
    public interface DbTransactionOperation<RESULT_TYPE> {
        /**
         * Executes the db transaction by using the passed entity manager
         *
         * @param em which will be used to access the database
         */
        RESULT_TYPE execute(EntityManager em) throws Exception;
    }
}
