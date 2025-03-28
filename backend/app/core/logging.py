import logging


def setup_logging():
    """
    Sets up the logging configuration for the application.

    - Configures the logging level to INFO.
    - Defines the log message format to include timestamp, logger name, and log level.
    - Creates and returns a logger instance for the application with the name 'HBVTracker'.

    Returns:
        logging.Logger: Configured logger instance.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    logger = logging.getLogger("HBVTracker")
    return logger
