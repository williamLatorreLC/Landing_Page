/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.util;

import jakarta.persistence.Query;
import jakarta.transaction.Transaction;
import jakarta.websocket.Session;
import jakarta.ws.rs.SeBootstrap.Configuration;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.imageio.spi.ServiceRegistry;


/**
 *
 * @author kompl
 */
public class MySqlUtils {

    Configuration configuration;

    Session sess;
    private static SessionFactory sessionFactory;

    Properties prop;
    

    public MySqlUtils(String path) {
        InputStream inputStream = null;
        prop = new Properties();
        try {

            inputStream = new FileInputStream(new File(path));

            if (inputStream != null) {
                prop.load(inputStream);
            } else {
                throw new FileNotFoundException("property file '" + path + "' not found in the classpath");
            }

        } catch (Exception e) {
            System.out.println("Exception properties: " + e);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException ex) {
                    System.out.println("Exception: " + ex);
                }
            }
        }
    }

    private void createSessionFactory() {
        configuration = new Configuration();
        configuration.configure("hibernate-mysql.cfg.xml").addProperties(prop);
        StandardServiceRegistryBuilder serviceReg = new StandardServiceRegistryBuilder();
        serviceReg.applySettings(configuration.getProperties());
        ServiceRegistry serviceRegistry = serviceReg.build();
        sessionFactory = configuration.buildSessionFactory(serviceRegistry);

    }

    private Session getSession() {
        if (sessionFactory == null) {
            createSessionFactory();
        } else if (sessionFactory.isClosed()) {
            createSessionFactory();
        }
        return sessionFactory.openSession();
    }

    public List read(String tablaClass) {
        List result;
        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            result = (List) sess.createQuery("from " + tablaClass + " ORDER BY id DESC").list();
            tran.commit();
        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
            result = new ArrayList();
        } finally {
            sess.close();
        }
        return result;
    }

    public List readBy(String tablaClass, String where) {
        List result;
        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            result = (List) sess.createQuery("from " + tablaClass + " where " + where).list();
            tran.commit();
        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
            result = new ArrayList();
        } finally {
            sess.close();
        }
        return result;
    }

    public Integer insert(Object data) {
        Integer result;
        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            result = (Integer) sess.save(data);
            tran.commit();
        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
            result = -1;
        } finally {
            sess.close();
        }
        return result;
    }

    public void update(Object data) {
        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            sess.update(data);
            tran.commit();
        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
        } finally {
            sess.close();
        }
    }

    public void delete(Object data) {
        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            sess.delete(data);
            tran.commit();
        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
        } finally {
            sess.close();
        }
    }
    
    
    public void deleteBy(String tablaClass, String where) {
        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            String sql = "DELETE "+tablaClass+" WHERE "+where;
            Query query = sess.createQuery(sql);
            query.executeUpdate();
            tran.commit();
        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
        } finally {
            sess.close();
        }
    }

    public List readQuery(String name, Map<String, Object> params) {

        List<Map<String, Object>> result;

        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            Query q = sess.getNamedQuery(name);

            Iterator it = params.entrySet().iterator();

            while (it.hasNext()) {
                Map.Entry item = (Map.Entry) it.next();

                if (item.getValue().getClass() == Integer.class) {
                    System.out.println("Integer");
                    System.out.println(item.getValue());
                    q.setParameter(item.getKey().toString(), Integer.parseInt(item.getValue().toString()));
                }

                if (item.getValue().getClass() == Date.class) {
                    System.out.println("Date");
                    q.setDate(item.getKey().toString(), (Date) item.getValue());
                }

                if (item.getValue().getClass() == Long.class) {
                    System.out.println("Long");
                    q.setParameter(item.getKey().toString(), Long.parseLong(item.getValue().toString()));
                }

                if (item.getValue().getClass() == String.class) {
                    System.out.println("String");
                    q.setParameter(item.getKey().toString(), item.getValue().toString());
                }
            }

            q.setResultTransformer(AliasToEntityMapResultTransformer.INSTANCE);

            result = q.list();
            tran.commit();

        } catch (Exception e) {
            if (tran != null) {
                ///tran.rollback();
                throw e;
            }
            result = new ArrayList();
        } finally {
            sess.close();
        }

        return result;
    }

    public List readQueryWithLimit(String name, int first, int max, Map<String, Object> params) {

        List<Map<String, Object>> result;

        Transaction tran = null;
        Session sess = getSession();
        try {
            tran = sess.beginTransaction();
            Query q = sess.getNamedQuery(name);

            Iterator it = params.entrySet().iterator();

            while (it.hasNext()) {
                Map.Entry item = (Map.Entry) it.next();

                if (item.getValue().getClass() == Integer.class) {
                    System.out.println("Integer");
                    System.out.println(item.getValue());
                    q.setParameter(item.getKey().toString(), Integer.parseInt(item.getValue().toString()));
                }

                if (item.getValue().getClass() == Date.class) {
                    System.out.println("Date");
                    q.setDate(item.getKey().toString(), (Date) item.getValue());
                }

                if (item.getValue().getClass() == Long.class) {
                    System.out.println("Long");
                    q.setParameter(item.getKey().toString(), Long.parseLong(item.getValue().toString()));
                }

                if (item.getValue().getClass() == String.class) {
                    System.out.println("String");
                    q.setParameter(item.getKey().toString(), item.getValue().toString());
                }
            }
            q.setFirstResult(first);
            q.setMaxResults(max);

            q.setResultTransformer(AliasToEntityMapResultTransformer.INSTANCE);

            result = q.list();
            tran.commit();

        } catch (Exception e) {
            if (tran != null) {
                throw e;
            }
            result = new ArrayList();
        } finally {
            sess.close();
        }

        return result;
    }

    public static void close() {
        sessionFactory.close();
    }

}
